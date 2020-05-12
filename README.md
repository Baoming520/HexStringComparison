# Compare Hex string and Readable XML string in MS-TDS

## Deployment

* Download Node.js here: https://nodejs.org/zh-cn/ and install it to local.
* Use the following command to check whether Node.js has been installed successfully.
  ```shell
  $ npm --version
  $ node --version
  ```
* Execute the following command to install all the required modules.
  ```shell
  npm install
  ```
* Modify the configuration.
  ```json
  {
    "check_xml_cwd": "<root dir for executing the validation program>",
    "check_xml_exe": "main.exe",
    "xml_file": "<xml data file>"
  }
  ```
  > NOTE: 
  > * Set the value of ***check_xml_cwd*** to the absolute path `./extensions/check_xml_format/dist`
  > * Set the value of ***xml_file*** to the absolute path `./data/xml_data.xml`

## Usage

* Copy the HEX string from MS-TDS in section 4, and then paste it to the file `./data/hex_data.txt`.
* Copy the XML string followed by the HEX string from MS-TDS in section 4, and then paste it to the file `./data/xml_data.xml`.
* Run the following command to start the program.
  ```shell
  $ node index.js
  ```

## Examples

### Ex 1

1. Copy the Hex string from MS-TDS in section 4.5, then paste it to the file `./data/hex_data.txt`.
 ![Example1-01][Example1-01]
2. Copy the XML string from MS-TDS in section 4.5, then paste it to the file `./data/xml_data.xml`.
 ![Example1-02][Example1-02]
3. Run the command `$ node index.js`, and get the following result.
 ![Example1-03][Example1-03]
4. Fix the error in line 87, after checking the code, then we can see that here miss an ending tag `</LONG>` in the end of line 86.
 ![Example1-04][Example1-04]
5. After fixing the issue, re-run the command `$ node index.js`, we found that there is another error in the line 145 as following image.
 ![Example1-05][Example1-05]
6. Fix the error in line 145, after checking the code, then we can see that here use an unmatched ending tag `</Byte>`.
 ![Example1-06][Example1-06]
7. After fixing the issue, re-run the command `$ node index.js`, then no error is found.
 ![Example1-07][Example1-07]   
 ![Example1-08][Example1-08]

### Ex 2

1. Copy the Hex string from MS-TDS in section 4.5, then paste it to the file `./data/hex_data.txt`.
2. Copy the XML string from MS-TDS in section 4.5, then paste it to the file `./data/xml_data.xml`.
3. Check the result as following.
 ![Example2-01][Example2-01]

## Tech

* Node.js
* Python 3 **(No need to install it.)**


[Example1-01]: ./images/eg_1_01.png
[Example1-02]: ./images/eg_1_02.png
[Example1-03]: ./images/eg_1_03.png
[Example1-04]: ./images/eg_1_04.png
[Example1-05]: ./images/eg_1_05.png
[Example1-06]: ./images/eg_1_06.png
[Example1-07]: ./images/eg_1_07.png
[Example1-08]: ./images/eg_1_08.png
[Example2-01]: ./images/eg_2_01.png