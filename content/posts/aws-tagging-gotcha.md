---
title: "AWS Tagging Gotcha"
date: 2025-11-20T16:46:35-08:00
draft: false
---

Recently while working on some AWS policies, I discovered a tricky gotcha in how the DeleteTags action works with conditioning. It took me a bit of head-scratching to figure out what was going on, so I wanted to share what I learned.

Let's say we have an AWS policy with one statement:
```
"Statement": [
    {
        "Sid": "DeleteTagFoo",
        "Effect": "Allow",
        "Action": [
            "ec2:DeleteTags"
        ],
        "Resource": [
            "arn:aws:ec2:*:*:subnet/*"
        ],
        "Condition": {
            "ForAllValues:StringLike": {
                "aws:TagKeys": [
                    "foo"
                ]
            }
        }
    }
]
```

The effect here should be that deleting a tag with the key "foo", and only that tag, should be allowed on any subnet.

And the following works as expected:

```
$ aws ec2 delete-tags --resource-id $SUBNET_ID --tags Key=foo
# This succeeds as expected, and the tag is removed from the subnet

$ aws ec2 delete-tags --resource-id $SUBNET_ID --tags Key=bar
# This fails as expected with an error of
`$ROLE is not authorized to perform: ec2:DeleteTags on resource $RESOURCE_ID because no identity-based policy allows the
ec2:DeleteTags action`
```

Everything as expected so far. But what if you don't specify a specific tag to delete?
```
$ aws ec2 delete-tags --resource-id $SUBNET_ID
```
This works, and uses our policy to delete every tag on the subnet, which is not what we want!

After digging through the AWS docs, I found that this behavior seems to be expected, and they have [an example](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html#access_tags_control-tag-keys) where they recommend adding an additional condition to prevent passing a request with no tags specified. To fix this in our policy, we need to update our condition to include a null check. In our example, the condition then becomes
```
        "Condition": {
            "ForAllValues:StringLike": {
                "aws:TagKeys": [
                    "foo"
                ]
            },
            "Null": {
                "aws:TagKeys": "false"
            }
        }
```

 With this additional condition in place, `$ aws ec2 delete-tags --resource-id $SUBNET_ID` now fails as expected, protecting all tags on the subnet from being accidentally deleted in one go.

You'd expect that restricting deletions to specific tag keys would cover all cases, but AWS treats an empty delete-tags request differently and will happily remove everything. If you're working with tag-based IAM policies, it's worth double-checking that you have this Null condition in place to avoid any surprises.