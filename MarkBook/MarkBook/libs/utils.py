import pdfkit


def word2pdf(path1, path2):
    return pdfkit.from_file(path1, path2)


if __name__ == '__main__':
    path = '/Users/caicai/Downloads/'
    word2pdf(path + 'python-面试.pdf', '2019-01-19.pdf')