/*
	We are assuming the file is very large and we 
	don't want to read everything into the memory at once, hence
	the need for a stream.
	If this constraint is not present. Use method 2 it's much simpler
*/

/*
	Method 1
	(i) Create a readable stream.
	(ii) Read chunks of data emitted, character by character
	(iii) Do not start writing until the first occurence of the special character.
	(iv) When the chunk has been completely read, be sure to terminate the listener, especially if you initiated a loop to process the characters.
*/

const fs = require('fs');
const charToStartFrom = '5';

const readableStream = fs.createReadStream(__dirname + '/testFile.txt', {
    encoding: 'utf8',
    autoClose: true,
    fd: null
});

let shouldRead = true;
let shouldWrite = false;
let desiredText1 = '';

readableStream.on('readable', function() {
	try {
		while (shouldRead) {
			// Read stream one character at a time
			let chunk = this.read(1);
			
			if (String(chunk) === charToStartFrom) {
				shouldWrite = true;
			}
			
			if (!chunk) {
				// Stream has ended.
				shouldRead = false;
				console.log('Method 1 \n', desiredText1, '\n');
				//The while loop would terminate now because shouldRead is now false.
			}
			
			if (shouldWrite) {
				// Do stuff with the chunk. I'll just build a string here but if you are working with 
				// a very large file, create a writable stream and write to it.
				desiredText1+=chunk;
			}
		}
	}
	catch(err) {
		console.warn(err);
	}
});




/* Method 2 */
/*
(i) Read the file as a utf8 string.
(ii) Split the string at any point where the special character occurs to get an array of substrings.
(iii) Discard the first substring because it comes before the first occurence of the special character.
(iv) Concatenate the remaining substrings
*/

const text = fs.readFileSync(__dirname + '/testFile.txt').toString();
let parts = text.split(charToStartFrom);
parts.splice(0,1);
let desiredText2 = '';
for (let i = 0; i < parts.length; i++) {
	desiredText2+=(parts[i]);
}
console.log('Method 2 \n', charToStartFrom + desiredText2, '\n');

