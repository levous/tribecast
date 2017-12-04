# Notes

## Rusty needs to learn


 - Mocha testing
   - Testing promises chai-as-promised (Bluebird?)
   - Testing in general (walk through memberController, for example, and test all interesting conditions)
 - realtime feedback
   - Tests
   - browser refresh
 - configuration best practices

## Business rules to support

 - Single member owning more than one property
   Presently, two records could exist with the same email address.  This is not yet supported by user links.  Need to support multiple members per user account and figure out rules when updating email address, name, etc

 - When a member is attached to a member and the first or last name are updated, push that change to the user name field

## Auth Defect

 - https://www.pivotaltracker.com/story/show/153384048
   Reference to Auth instance maintains its reference to UserData
   store.subscribe is not working.
