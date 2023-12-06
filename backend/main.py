from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Union, Any
from pydantic import BaseModel
import pandas as pd
from utils import us_states
import numpy as np

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

'''
Statistics:
--------------------------------
H-1B               4469533
H-2A                105392
E-3 Australian       73505
H-2B                 36083
H-1B1 Singapore       7017
H-1B1 Chile           5473
--------------------------------=
Professional and business services                                   3773056
Educational services, health care, and social assistance              322489
Finance, insurance, real estate, rental, and leasing                  210310
Others                                                                164934
Agriculture, forestry, fishing, and hunting                           107173
Arts, entertainment, recreation, accommodation, and food services      62369
Information                                                            23325
Utilities                                                              18385
Manufacturing                                                           3708
Government                                                              3312
Construction                                                            3193
Transportation and Warehousing                                          2079
Wholesale and Retail Trade                                              1966
Real estate and rental and leasing                                       560
Mining                                                                   144
-------------------------------

'''

class FilterStates(BaseModel):
    selectedFiltersArr: List[List[str]]
    filterNames: List[str]

class LineData(BaseModel):
    label: str
    data: List[Union[int, float]]
    fill: bool = False

class LineChartData(BaseModel):
    labels: List[str]
    datasets: List[LineData]

class StackedBarQuery(BaseModel):
    year: int
    selectedCountries: List[str]
    selectedVisas: List[str]

class StackedBarData(BaseModel):
    labels: List[str]
    datasets: List[Dict[Any, Any]]



'''
{
    labels: xData,
    datasets: Array.from({ length: yDataArr.length }, (_, i) => i).map(i => ({
      label: yLabelArr[i],
      data: yDataArr[i],
      fill: false
    }))
}
'''

gdp_data = pd.read_csv("data/gdp_2010_2020.csv")
all_sectors = list(gdp_data['Sector'])[:-1]
all_sector_gdp = gdp_data[gdp_data['Sector'] == 'All Sector']

yearly_mean_wage_per_state = pd.read_csv("data/yearly_mean_wage_per_state.csv")
yearly_mean_wage_per_visa = pd.read_csv("data/yearly_mean_wage_per_visa.csv")
yearly_mean_wage_per_sector = pd.read_csv("data/yearly_mean_wage_per_sector.csv")

all_visas_data = pd.read_csv("data/h1b_h2b_h2a_2010_2020.csv")

@app.post("/api/lineplot", tags=["lineplot"])
async def lineplot(filterStates: FilterStates) -> LineChartData:
    print("filterStates:", filterStates)

    selectedStates = []
    selectedVisas = []
    selectedSectors = ['All Sector'] ### By default it will be All Sector

    if len(filterStates.selectedFiltersArr[0]) > 0:
        selectedStates = filterStates.selectedFiltersArr[0]
        selectedStates = [us_states[i] for i in selectedStates]
        temp_mean_wage_per_state = yearly_mean_wage_per_state[yearly_mean_wage_per_state['State'].isin(selectedStates)]
        print(temp_mean_wage_per_state)
    if len(filterStates.selectedFiltersArr[1]) > 0:
        selectedVisas = filterStates.selectedFiltersArr[1]
        temp_mean_wage_per_visa = yearly_mean_wage_per_visa[yearly_mean_wage_per_visa['Visa'].isin(selectedVisas)]
        print(temp_mean_wage_per_visa)

    if len(filterStates.selectedFiltersArr[2]) > 0:
        selectedSectors = filterStates.selectedFiltersArr[2]
        selectedSectors.append('All Sector')
        temp_mean_wage_per_sector = yearly_mean_wage_per_sector[yearly_mean_wage_per_sector['Sector'].isin(selectedSectors)]
        print(temp_mean_wage_per_sector)

        

    temp_mean_wage_per_sector = yearly_mean_wage_per_sector[yearly_mean_wage_per_sector['Sector'].isin(selectedSectors)]
    # print(temp_gdp_df)

    # if len(selectedSectors) > 0 and selectedSectors[0] != 'All Sector':
    #     temp_gdp_df = temp_mean_wage_per_sector
        # print(temp_gdp_df)

    if len(selectedStates) > 0:
        temp_mean_wage_per_state.columns = temp_mean_wage_per_sector.columns
        dfs = [temp_mean_wage_per_sector, temp_mean_wage_per_state]
        temp_mean_wage_per_sector = pd.concat(dfs, ignore_index=True)
        # print(temp_gdp_df.shape)
        # print(temp_gdp_df.head())
    
    if len(selectedVisas) > 0:
        temp_mean_wage_per_visa.columns = temp_mean_wage_per_sector.columns
        dfs = [temp_mean_wage_per_sector, temp_mean_wage_per_visa]
        temp_mean_wage_per_sector = pd.concat(dfs, ignore_index=True)
        # print(temp_gdp_df.shape)
        # print(temp_gdp_df.head())

    xArr = temp_mean_wage_per_sector.columns[1:].tolist()
    yArr = []
    for i in range(len(temp_mean_wage_per_sector)):
        yArr.append(temp_mean_wage_per_sector.iloc[i, 1:].astype(float).tolist())
    yLabelArr = temp_mean_wage_per_sector.iloc[:, 0].tolist()
    return LineChartData(labels=xArr, datasets=[LineData(label=yLabelArr[i], data=yArr[i]) for i in range(len(yArr))])



@app.post("/api/stackedbar", tags=["stackedbar"])
async def stackedbar(query: StackedBarQuery) -> StackedBarData:
    print(query.year, query.selectedCountries, query.selectedVisas)
    return StackedBarData(
        labels=["2015", "2014", "2013", "2012", "2011"],
        datasets=[
            {
                "data": [727, 589, 537, 543, 574],
                "backgroundColor": "rgba(63,103,126,1)",
                "hoverBackgroundColor": "rgba(50,90,100,1)"
            },
            {
                "data": [238, 380, 426, 453, 502],
                "backgroundColor": "rgba(163,103,126,1)",
                "hoverBackgroundColor": "rgba(140,85,100,1)"
            },
            {
                "data": [123, 387, 543, 234, 112],
                "backgroundColor": "rgba(63,203,126,1)",
                "hoverBackgroundColor": "rgba(50,180,100,1)"
            },
            {
                "data": [423, 189, 287, 153, 12],
                "backgroundColor": "rgba(163,203,126,1)",
                "hoverBackgroundColor": "rgba(140,180,100,1)"
            }
        ]
    )

@app.post("/api/sankey", tags=["sankey"])
async def sankey(filterStates: FilterStates) -> List[List[Any]]:
    print("filterStates:", filterStates)
    selectedYears = ['2020']
    selectedVisas = []
    selectedSectors = []
    if len(filterStates.selectedFiltersArr[0]) > 0:
        selectedVisas = filterStates.selectedFiltersArr[0]
        print("selectedVisas:", selectedVisas)
    if len(filterStates.selectedFiltersArr[1]) > 0:
        selectedSectors = filterStates.selectedFiltersArr[1]
        print("selectedSectors:", selectedSectors)
    if len(filterStates.selectedFiltersArr[2]) > 0 and filterStates.selectedFiltersArr[2][0]!='2020':
        selectedYears = filterStates.selectedFiltersArr[2]
        print("selectedYears:", selectedYears)

    selectedYears = [int(year) for year in selectedYears]
    # print("SelectedYears:", selectedYears)
    selected_year_df = all_visas_data[all_visas_data['Year'].isin(selectedYears)]
    sector_counts = selected_year_df.groupby(['Visa', 'Sector']).size().reset_index(name='Count')
    
    if len(selectedVisas) > 0:
        sector_counts = sector_counts[sector_counts['Visa'].isin(selectedVisas)]
    
    if len(selectedSectors) > 0:
        sector_counts = sector_counts[sector_counts['Sector'].isin(selectedSectors)]
    
    total_sum = sector_counts['Count'].sum()
    sector_counts['Percentage'] = sector_counts.apply(lambda x: x['Count']/total_sum, axis = 1)
    # print("sector_counts:", sector_counts.head())

    all_sectors = list(set(list(gdp_data['Sector'])[:-1]).intersection(set(list(sector_counts['Sector']))))
    # print("all_sectors:", all_sectors)

    if len(selectedSectors) > 0:
        sector_wise_gdp = gdp_data[gdp_data['Sector'].isin(selectedSectors)]
        all_sectors = list(set(all_sectors).intersection(set(list(sector_wise_gdp['Sector']))))
    else:
        sector_wise_gdp = gdp_data[gdp_data['Sector'].isin(all_sectors)]
    

    data = [["From", "To", "Percentage"]]
    for idx, row in sector_counts.iterrows():
        data.append([row['Visa'], row['Sector'], row['Percentage']])
    for idx, row in sector_wise_gdp.iterrows():
        data.append([row['Sector'], 'Gross GDP', row[str(selectedYears[0])]/all_sector_gdp[str(selectedYears[0])].values[0]])
    
    return data