from typing import Optional, Any
import requests

_API_URL: str = "https://api.dictionaryapi.dev/api/v2/entries/en_US/"


def _format_api_definition(definition: Any) -> str:
    """
    Format the JSON object receieved from the API into a string

    :param definition: the definition JSON object from the API
    :type definition: Any
    :return: the definition(s) formatted as a string
    :rtype: str
    """

    keys = definition.keys()

    definition_parts = []

    if "partOfSpeech" in keys:
        definition_parts.append("({})".format(definition["partOfSpeech"]))

    if "definitions" in keys:
        def_obj_parts = []
        for def_obj in definition["definitions"]:
            subdef_parts = [def_obj["definition"]]
            if "example" in def_obj.keys():
                subdef_parts.append("\tExample: {}".format(def_obj["example"]))
            if "synonyms" in def_obj.keys():
                subdef_parts.append(
                    "\tSynonyms: {}".format(", ".join(def_obj["synonyms"]))
                )

            def_obj_parts.append("\n".join(subdef_parts))

        definition_parts.append("\n".join(def_obj_parts))

    return "\n".join(definition_parts)


def get_definition(word: str) -> Optional[str]:
    """
    Get the dictionary defintion of the given word. If the definition cannot be found, returns `None`.

    :param word: the word.
    :type word: str
    :return: the definition of the given word, if found. Otherwise, returns `None`.
    :rtype: Optional[str]
    """

    request_url = f"{_API_URL}{word}"
    response = requests.get(request_url)

    if not response.ok:
        return None

    formatted_defintions = [
        _format_api_definition(definition)
        for definition in response.json()[0]["meanings"]
    ]

    return "\n".join(formatted_defintions)
