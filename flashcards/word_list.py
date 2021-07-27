from typing import List
from pathlib import Path
import csv
import json
import functools

def _get_words_from_csv(path: Path) -> List[str]:
    """
    Get a list of words from the given CSV. Words should be in either be one column or
    one comma separated row

    :param path: the path to the file
    :type path: Path
    :return: a list of words contained in the file
    :rtype: List[str]
    """

    with open(path, newline='') as f:
        data = list(csv.reader(f, delimiter=' ', quotechar='|'))
        if len(data) == 1:
            split_string = data[0][0].split(",")
            split_string = [s.strip() for s in split_string]
            return split_string
        else:
            return list(functools.reduce(lambda x, y: x + y, data))

def _get_words_from_json(path: Path) -> List[str]:
    """
    Get a list of words from a JSON file. Words should be in a JSON array with no surrounding
    object.

    :param path: the path to the file
    :type path: Path
    :return: the list of words contained in the file
    :rtype: List[str]
    """

    with open(path) as f:
        return json.load(f)

def _get_words_from_txt(path: Path) -> List[str]:
    """
    Get a list of words from a text file. There should be one word per line, with no commas or quotations

    :param path: the path to the file
    :type path: Path
    :return: the list of words contained in the file
    :rtype: List[str]
    """

    with open(path) as f:
        words = f.readlines()
        return list(map(lambda x: x.strip(), words))

def get_word_list(path: Path) -> List[str]:
    """
    Get a list of words from the given file. The file extension determines how the
    words are parsed from the file.

    Currently supported files are:
        * CSV
        * JSON
        * TXT (single entry per line, no commas)

    :param path: the path to the file
    :type path: Path
    :return: a list of words contained in the file
    :rtype: List[str]
    :raise: `ValueError` if an unsupported file is given
    """

    if path.suffix == ".csv":
        return _get_words_from_csv(path)
    elif path.suffix == ".json":
        return _get_words_from_json(path)
    elif path.suffix == ".txt":
        return _get_words_from_txt(path)
    else:
        raise ValueError(f"Unsupported file type: .{path.suffix}")
    