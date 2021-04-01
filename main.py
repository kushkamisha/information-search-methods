from Compression import Compress
import os

# directory = 'D:\KMA\\2\IR\\'
directory = 'data/'
files = os.listdir(directory)
books = [directory+x for x in files if x.endswith('.txt')]

if __name__ == "__main__":
    compr = Compress(books)
    # compr.compress_dict()
    compr.compress_postings()
    # compr.write()
    # print(compr.ptr_to_post)
