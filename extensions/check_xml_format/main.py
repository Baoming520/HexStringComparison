from xml.sax.handler import ContentHandler
from xml.sax import parseString

import chardet
import os
import sys

def main(argv=None):
    try:
        if len(sys.argv) < 2:
            print('Error: miss required parameter')
            return
        xml_file = sys.argv[1]
        if not os.path.exists(xml_file):
            print('Error: xml file is not found')
            return
        with open(xml_file, 'rb') as f:
            bi_data = f.read()
            info = chardet.detect(bi_data)
            data = bi_data.decode(encoding=info['encoding'])
            xml_string = '<root>' + data + '</root>'
        parseString(xml_string, ContentHandler())
        print('Success: no error founds in the xml file')
    except Exception as ex:
        print('Error: {}'.format(ex))

if __name__ == '__main__':
    main()