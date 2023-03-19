![](https://res.cloudinary.com/dpwoods/image/upload/v1586638762/img_assets/imseeking-video-to-gif.gif)

## Overview

ImSeekingGeeks is an online dating platform only available in the US that lets you the meet the most amazing singles. ImSeekingGeeks REST/API is built using Typescript/Express.js on the back-end with a MongoDB database.

To view the application go to: []()
And older version may be found here

## Seeding DB

To seed the mongoDB run:

`npm run seed`

## Docker

`docker build -t im-seeking-geeks .`

`docker run -it -p 3000:3000 im-seeking-geeks`

## Running application

To start the app:

`npm run start`

To run the application in watch mode:
`npm run watch-node`

## Test Coverage

To view test coverage:
`npm run test`

-----------------------|---------|----------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------
All files | 50.81 | 82.24 | 23.59 | 50.81 |
**tests**/mocks | 100 | 100 | 100 | 100 |
messages.mock.ts | 100 | 100 | 100 | 100 |
users.mock.ts | 100 | 100 | 100 | 100 |
zipcodes.mock.ts | 100 | 100 | 100 | 100 |
config | 100 | 100 | 100 | 100 |
default.server.ts | 100 | 100 | 100 | 100 |
controllers | 30.82 | 81.31 | 46.87 | 30.82 |
AuthController.ts | 15.15 | 100 | 0 | 15.15 | 10-15,19-24,27-67,70-108,112-119,122-164,167-179,183-194
ProfileController.ts | 35.58 | 81.31 | 62.5 | 35.58 | 10-16,19-92,108-110,126-128,162-163,280-282,285-287,300-301,314-475,478-481,484-506,509-518,521-541,544-549,552-648
middlewares | 80.64 | 71.42 | 100 | 80.64 |
isAuthenticated.ts | 80.64 | 71.42 | 100 | 80.64 | 18-19,22-25
models | 58.2 | 100 | 0 | 58.2 |
message.model.ts | 91.17 | 100 | 0 | 91.17 | 58-60,63-65
user.model.ts | 52.25 | 100 | 0 | 52.25 | 160-166,173-187,190-202,205-212,215-220,223-238,241-254,257-274,277-282,285-302,305-314,317-322,324-334,337-355,358-360,363-370,373-374
routes | 100 | 100 | 100 | 100 |
auth.routes.ts | 100 | 100 | 100 | 100 |
profile.routes.ts | 100 | 100 | 100 | 100 |
services | 15.86 | 100 | 0 | 15.86 |
ProfileService.ts | 12.19 | 100 | 0 | 12.19 | 15-46,49-82,85-145,149-182,185-212,216-238,241-261,264-269,272-276,279-309,312-324
UserService.ts | 19.93 | 100 | 0 | 19.93 | 6-15,18-24,28-35,38-42,45-138,142-147,151-161,165-173,177-185,189-200,204-214,218-223,226-231,234-239,242-246,249-253,256-260,263-267,270-274,277-281,284-289,292
utils | 100 | 100 | 100 | 100 |
server.ts | 100 | 100 | 100 | 100 |
-----------------------|---------|----------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------
