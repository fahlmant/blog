---
title: "Using an existing VPC with OpenShift"
date: 2021-03-24T11:51:25-07:00
---

OpenShift Dedicated recently enabled installing an OpenShift cluster into an existing AWS VPC (aka BYO VPC). While testing this out, I couldn’t find much documentation around how the VPC should be set up other than a few points:
- The VPC should have dnsHostnames enabled
- There should be a public subnet (per AZ the cluster is in) 
- There should be a private subnet (per AZ the cluster is in)

The first point is fairly straight forward, but the other two are somewhat vauge. What is considered a public subnet and what is considered a private subnet? What other resources in AWS are required to make those requirements fufilled?
It took me several days of trying and failing to install a cluster into a BYO VPC before I finally figured out a correct configuration. Here’s what I found:
For this example, I will only be describing a single-az setup, specifically us-east-1a. First, create the VPC, give it a name, and give it a resonable CIDR range, like 10.0.0.0/16. You also need to enable DNS Hostnames.

```
$ aws ec2 create-vpc --cidr-block 10.0.0.0/16
$ aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames

```

Great, point one of our requirements are met! Now for the subnets.

In AWS, a “public” subnet is a subnet that can send outbound traffic directly to the internet. To do this, an Internet Gateway is used.
Create the Internet Gateway and attach it to the VPC

```
$ aws ec2 create-internet-gateway
$ aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
```

Now create a subnet with some reasonable amount of IPs from the VPC CIDR. I used a /17 for simplicity, but smaller ranges can be used.

```
$ aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.0.0/17
```

To allow this subnet to use the Internet Gateway, create a Route Table, associate the subnet with it, and create a routing rule for 0.0.0.0/0 -> Internet Gateway

```
$ aws ec2 create-route-table --vpc-id $VPC_ID
$ aws ec2 associate-route-table --route-table-id $PUB_RT_ID --subnet-id $PUB_SUBNET_ID
$ aws ec2 create-route --route-table-id $PUB_RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
```

Nice, now you have a public subnet and point two of our requirements is met. Finally for the private subnet.
In AWS, a private subnet doesn’t have direct access to the internet, and the internet does not have direct access to it. Instead, the private subnet access the internet through a NAT Gateway from within the public subnet. This allows anything in the private subnet to still be able to access the internet for updates and connections, but protects from access to the subnet initiated from the public internet.
To create our private subnet, we first need to allocate an EIP, and create a NAT Gateway in the public subnet with that EIP.

```
$ aws ec2 allocate-address
$ aws ec2 create-nat-gateway --subnet-id $PUB_SUB_ID --allocation-id $EIP_ID
```

Now we can create the private subnet. I also gave it a /17 CIDR but again this can be smaller
```
$ aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.128.0/17
$ aws ec2 create-route-table --vpc-id $VPC_ID
$ aws ec2 associate-route-table --route-table-id $PRV_RT_ID --subnet-id $PRV_SUBNET_ID
$ aws ec2 create-route --route-table-id $PRV_RT_ID --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_GW_ID
```

And that’s all we need! All three points are met, and we can now use this VPC to create an OpenShift cluster.
