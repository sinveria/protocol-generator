from .protocol_individual import IndividualProtocolGenerator
from .list_grades import ListGradesGenerator
from .list_citizenship import ListCitizenshipGenerator
from .general_list import GeneralListGenerator
from .chairman_report import ChairmanReportGenerator

GENERATORS = {
    g.doc_type: g for g in [
        IndividualProtocolGenerator,
        ListGradesGenerator,
        ListCitizenshipGenerator,
        GeneralListGenerator,
        ChairmanReportGenerator,
    ]
}

def get_generator(doc_type):
    cls = GENERATORS.get(doc_type)
    if not cls:
        raise ValueError(f"Неизвестный тип документа: {doc_type}")
    return cls