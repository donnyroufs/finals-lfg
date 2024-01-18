# The Finals: Group Finder

## Notes

Learning project that consists of two new technologies (for me):
- Auth0
- Mikro-ORM

I am also utilizing mikro-orm to couple my domain entities with the database to see if it's a coupling
that I would consider for future projects. Thus far, I like it but also dislike it. Will need to do a bit more
research to understand their way of defining relationships so that I can *avoid* persistence concerns to an extent.

The tests are flaky because I seem to be misunderstanding how mikro-orm utilizes context. Not to mention that
unit testing was a complete pain. Decorating methods causes exceptions to be thrown.

## Features

- A user who logs in through Auth0 will automatically be a contestant in our app.
- A contestant can join the group finder, when three contestants have joined a group will be created.
- After a group has been created, the contestant can join again.
