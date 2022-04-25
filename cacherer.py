#!/usr/bin/env python3

import os,re,sys,requests

from bs4 import BeautifulSoup as BS

directory = 'lib/'
exclusions = [
	'https://cdn.tinymce.com/4/tinymce.min.js'
]

def get(url):
	if url.startswith(directory) or url in exclusions:
		path = url
	else:
		path = url.replace('http://','https://').replace('https://',directory)
		if path != url:
			dir = os.path.dirname(path)
			if not os.path.isdir(dir) and len(dir):
				os.makedirs(dir)
			if not os.path.isfile(path):
				result = requests.get(url)
				if result.status_code == 200:
					with open(path,'w') as output:
						output.write(result.text)
				else:
					sys.stderr.write('%s\n'%result.text)
	print('\t%s'%path.split('/')[-1])
	return path
	
def main():
	for file in os.listdir('.'):
		if not file.split('.')[-1].lower().endswith('html'): 
			continue
		with open(file) as input:
			print(file)
			bs = BS(input.read(),'html5lib')
			
			for link in bs.find_all('link'):
				if 'href' not in link.attrs.keys():
					continue
				link.attrs['href'] = get(link.attrs['href'])
				
			for script in bs.find_all('script'):
				if 'src' not in script.attrs.keys():
					continue
				script.attrs['src'] = get(script.attrs['src'])

			with open(file,'w') as output:
				output.write(bs.prettify())
				
if __name__ == '__main__': main()

