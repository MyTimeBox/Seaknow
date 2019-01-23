import time

import requests


PATH = '/Users/caicai/Downloads/数据集2/'
downloaded_urls = []

if __name__ == '__main__':
    file = '/Users/caicai/Downloads/统计学习方法/datasets/sexy_urls.txt'
    print(downloaded_urls)
    with open(file, 'rb') as f:
        for url in f.readlines():
            imgpath =PATH + time.ctime() + '.jpg'
            try:
                if b'phncdn' not in url and url not in downloaded_urls:
                    img = requests.get(url)
                    print(img.content)
                    with open(imgpath, 'wb') as q:
                        q.write(img.content)
                        downloaded_urls.append(url)
                        print('success')
            except Exception as e:
                print(e)
                pass

