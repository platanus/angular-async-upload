# Angular Async Upload

It's an angular directive to perform asynchronous file uploads. It's built on top of [Ng-File-Upload](https://github.com/danialfarid/ng-file-upload) and it was created to play with [Paperclip Upload](https://github.com/platanus/paperclip_upload) gem. Even though, it's not mandatory to use RoR or Paperclip Upload. You can always mimic the server functionality.

## Installation

```bash
bower install ng-file-upload --save
bower install https://github.com/platanus/angular-async-upload --save
```

Include the JS files in your project and the library as an Angular Dependency

```javascript
angular.module('yourapp', ['platanus.asyncUpload']);
```

> The library comes with a proposed stylesheet under `/dist/angular-async-upload.css`. You can use it or
> create your own.

## Usage

To make it simple, I'm going to give a use case example...

Suppose you have a `User` model. This model has two attributes: `avatar` (user photo) and `file` (a document or spreadsheet).

If you send all the data at once, you will have a rather large payload, and if it fails, all you will have is an angry user. So, from your application, you want to let the user:

1. Upload the avatar. See a preview (a thumbnail maybe), be sure the upload was successful.
2. Upload the  file. See a preview (a link), be sure the upload was successful.
3. Submit the form and link all the user data on the server.

In short, you want to make different requests to upload avatar and file attributes and then save the user with all the data in a lighter request.

**The advantages of doing this are:**

- You can have feedback after each file is saved.
- You can send to the server all the files you want. The final request (when you save the user), will have references to saved resources not the files themselves, making the request lighter.

So, to achieve this, we can use the Async Upload Directive

This directive allows you to perform a `POST` to a given endpoint (`/uploads` on this example) with a file. The url must return a file identifier. This identifier (that represents the uploaded file), will be stored inside an attribute (`user.avatarIdentifier` or `user.fileIdentifier`) passed to the `ng-model`.

```html
<async-upload
  upload-url="uploads"
  button-label="Select Avatar..."
  ng-model="user.avatarIdentifier">
</async-upload>

<async-upload
  upload-url="api/uploads"
  start-callback="startCallback(file)"
  success-callback="successCallback(uploadData)"
  progress-callback="progressCallback(event)"
  error-callback="errorCallback(errorData)"
  remove-callback="removeCallback()"
  ng-model="user.fileIdentifier">
</async-upload>
```

In order to work the `POST /uploads` response must be a json with the following format:

```json
{
  "upload": {
    "identifier": "some hash",
  }
}
```
> [Paperclip Upload](https://github.com/platanus/paperclip_upload) solves the server side for you.

## Directive Options:

### Mandatory

- *ng-model:* to keep the identifier(s) of the uploaded file. If *multiple* attribute is "true", the model will have a value like this: `["EJ6pOl5Y", "ZN5BaK3j"]` otherwise `"EJ6pOl5Y"`
- *upload-url:* must contain the url to perform the `POST` to save files.

### Optional

- *button-label:* you can pass this key as an HTML attribute to customize the upload button label. "Select File..." is the default value.
- *multiple:* if present, the uploader will allow multiple file selection.
- *init-callback:* to perform your own operations when upload process begins.
- *start-callback:* to perform your own operations when upload process begins for each file to upload.
- *success-callback:* to perform your own operations after a successful upload.
- *progress-callback:* it gives you information about upload progress.
- *error-callback:* to perform operations after a failed upload.
- *done-callback:* to perform your own operations when all upload processes have finished.
- *remove-callback:* to perform operations after click on remove icon.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Credits

Thank you [contributors](https://github.com/platanus/angular-async-upload/graphs/contributors)!

<img src="http://platan.us/gravatar_with_text.png" alt="Platanus" width="250"/>

angular-async-upload is maintained by [platanus](http://platan.us).

## License

angular-async-upload is © 2015 platanus, spa. It is free software and may be redistributed under the terms specified in the LICENSE file.
