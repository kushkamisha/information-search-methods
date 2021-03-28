import string
import re


class Compress:
    def __init__(self, books):
        self.books = books
        self.dictionary = {}
        self.string_dict = bytearray()
        self.pointers = []
        self.ptr_to_post = []
        self.words = []
        self.__create()

    def __create(self) -> None:
        file_id = 1
        for i in self.books:
            try:
                with open(i) as file:
                        for line in file:
                            for word in re.findall(
                                    r"[^—…”“‘" + string.whitespace + string.punctuation + string.digits + "]+", line):
                                word = word.lower()
                                if word in self.dictionary:
                                    if file_id not in self.dictionary[word]:
                                        self.dictionary[word].append(file_id)
                                else:
                                    self.dictionary[word] = [file_id]
                file_id += 1
            except FileNotFoundError:
                print('Файл {} не знайдено!'.format(i))
                del self.books[i]
        self.words = list(self.dictionary.keys())
        self.words.sort()

    def compress_dict(self):
        k = 0
        for w in self.words:
            if k % 4 == 0:
                curr_length = len(self.string_dict)
                self.pointers.append(curr_length)
            self.string_dict.append(len(w))
            self.string_dict += w.encode()
            k += 1

    def compress_postings(self):
        for k in range(len(self.words)):
            self.ptr_to_post.append(None)
        # print(len(self.words))
        for k in range(len(self.words)):
            v = self.dictionary[self.words[k]]
            # print(self.words[k])
            v = Compress.differences(v)
            numb = "1"
            for i in v:
                g = Compress.gamma(i)
                numb += g
            dec = int(numb, 2)
            print(numb)
            # print(dec)
            self.ptr_to_post[k] = dec
            print(Compress.decode_gamma(dec))

    @staticmethod
    def gamma(n) -> str:
        b = str(bin(n))[3:]
        unar = '1'*len(b)
        return unar+'0'+b

    @staticmethod
    def decode_gamma(g) -> list:
        b = str(bin(g))[3:]
        res = []
        ch = 0
        count = 0
        n = '1'
        while ch < len(b):
            if b[ch] == '1':
                count += 1
                ch += 1
            elif b[ch] == '0':
                for i in range(count):
                    ch += 1
                    n += b[ch]
                res.append(int(n, 2))
                n = '1'
                ch += 1
                count = 0
        return res

    @staticmethod
    def differences(posting_list: list) -> list:
        diffs = [posting_list[0]]
        for i in range(len(posting_list) - 1):
            diffs.append(posting_list[i + 1] - posting_list[i])
        return diffs

    def write(self) -> None:
        with open('dict.txt', 'wb') as file:
            file.write(self.string_dict)
            # file.write('{}\n{}'.format(self.string_dict, self.pointers))
