# dashv

http://dashv.co

This is a website that shows the version number of many popular programming languages/frameworks, all in one place. Just in case you were wondering what versions your favourite technologies are currently on if you haven't been up to date in a while...

The website is hosted on Amazon S3 and uses API Gateway & Lambdas to retrieve the version information from the Github API in parallel.

Feel free to contribute! If there is a programming language/framework hosted on Github that you would like to add, submit a PR with these additions:
- Add a new entry to the the technologies array in Technologies.js
- Add a new image for the technology in dashv-frontend/src/assets/images and reference it in the array entry in step 1

Once approved and merged, the CI on Github Actions will run and the changes will be automatically deployed. 
