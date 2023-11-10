from typing import List, Set
from pydantic import BaseModel, ConfigDict

class FilterStates(BaseModel):
    model_config = ConfigDict(validate_assignment=True)
    selectedFiltersArr: List[Set[str]]
    filterNames: List[str]

filterStates = FilterStates(selectedFiltersArr=[{"a", "b"}, {"c", "d"}], filterNames=["a", "b", "c", "d"])

# check if filterStates is valid
print(filterStates.json())