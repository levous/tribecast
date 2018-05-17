db.users
    .find(
        {
            "confirmedAt": null,
            "$or": [ 
                { "createdAt": {"$lte" : ISODate("2018-05-01T10:03:46Z") } },
                { "createdAt": null }
            ]
        }
    )
    .forEach( function(user) {
        db.members.update( 
            { "memberUserKey": user.memberUserKey },
            { "$set": { "memberUserKey" : null } }
        );

        db.users.remove( 
            { "_id" : user._id } 
        );
    });