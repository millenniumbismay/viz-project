from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Union, Any
from pydantic import BaseModel
import pandas as pd
from utils import us_states, regions, visa_color_pickers
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
    filterCategory: str

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

### Loading NIV Data
years = list(range(2010, 2021))
for year in years:
  exec(f"niv_{year} = pd.read_csv('data/niv_FY{year}.csv')")

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
    print(query.year, query.selectedCountries, query.selectedVisas, query.filterCategory)
    year = query.year
    category = query.filterCategory
    selectedVisas = query.selectedVisas
    selectedCountries = query.selectedCountries

    region_visa_year_dict = dict()
    if category == 'visa':
        year_df = globals()[f"niv_{year}"].copy()
        # print(year_df.head())
        column_indices = list(range(1, len(year_df.columns)-1, 1))
        year_df['total_num_people'] = year_df.iloc[:, column_indices].sum(axis = 1)
        region_visa_df = year_df[year_df['region'].isin(regions)]
        region_visa_df = region_visa_df.drop(f'Fiscal Year {year}', axis = 1)
        dict_records = region_visa_df.to_dict(orient='records')
        region_visa_year_dict[year] = dict()
        for record in dict_records:
            if record['region'] not in regions:
                print("Region {} not found!".format(record['region']))
                continue
            region_visa_year_dict[year][record['region']] = dict()
            for visa, num_people in record.items():
                if visa not in ['region']:
                    region_visa_year_dict[year][record['region']][visa] = num_people
            region_visa_year_dict[year][record['region']] = dict(sorted(region_visa_year_dict[year][record['region']].items(), key=lambda x:x[1], reverse = True))
        region_visa_year_dict[year] = dict(sorted(region_visa_year_dict[year].items(), key=lambda x:x[1]['total_num_people'], reverse = True))

    if len(region_visa_year_dict) > 0:
        visas_to_visualize = ['H-1B', 'H-2A', 'H-2B', 'E-2', 'E-3']

        if len(selectedVisas) > 0:
            visas_to_visualize = selectedVisas

        # print(region_visa_year_dict[year])
        labels = region_visa_year_dict[year].keys()
        # print("labels: ", labels)

        visa_dict = {visa_type: [] for visa_type in visas_to_visualize}

        if len(selectedVisas) == 0:
            visa_dict['Others'] = []

        for region in labels:
            for k, v in visa_dict.items():
                if k!='Others':
                    v.append(region_visa_year_dict[year][region][k])

            if len(selectedVisas) == 0:
                others_cnt = 0
                for visa_type, cnt in region_visa_year_dict[year][region].items():
                    if visa_type not in visas_to_visualize and visa_type != 'total_num_people':
                        others_cnt += cnt
                visa_dict['Others'].append(others_cnt)
        
        # print("visa dict: ", visa_dict)

        datasets = list()
        color_i = 0
        for visa_type, region_wise_cnt in visa_dict.items():
            temp_dict = dict()
            temp_dict['data'] = region_wise_cnt
            temp_dict['backgroundColor'] = visa_color_pickers[color_i]['backgroundColor']
            temp_dict['hoverBackgroundColor'] = visa_color_pickers[color_i]['hoverBackgroundColor']
            temp_dict['label'] = visa_type
            color_i += 1

            datasets.append(temp_dict)

        return StackedBarData(
            labels = labels,
            datasets = datasets
        )

    region_country_dict = dict()
    if category == 'country':
        print("Country!!!")
        year_df = globals()[f"niv_{year}"].copy()
        column_indices = list(range(1, len(year_df.columns)-1, 1))
        year_df['total_num_people'] = year_df.iloc[:, column_indices].sum(axis = 1)
        year_df = year_df.iloc[:, -2:]

        region_indices = dict()
        for region in regions:
            region_index = year_df.index[year_df['region'] == region].tolist()
            region_indices[region] = region_index[0]
            region_indices = dict(sorted(region_indices.items()))
        print(region_indices)

        prev_idx = 0
        for region, region_idx in region_indices.items():
            selected_rows = year_df.iloc[prev_idx:region_idx]
            region_country_dict[region] = dict(zip(selected_rows['region'], selected_rows['total_num_people']))
            region_country_dict[region]['Total'] = year_df.iloc[region_idx]['total_num_people']
            prev_idx = region_idx + 1
            region_country_dict[region] = dict(sorted(region_country_dict[region].items(), key = lambda x: x[1], reverse = True))

        region_country_dict = dict(sorted(region_country_dict.items(), key = lambda x: x[1]['Total'], reverse = True))
        print(region_country_dict)
    
    if len(region_country_dict) > 0:
        countries_to_visualize = list()

        for region_name, countries_list in region_country_dict.items():
            countries_to_visualize.extend(list(countries_list.keys())[1:6])
        if len(selectedCountries) > 0:
            countries_to_visualize = selectedCountries
        print("countries_to_visualize: ", countries_to_visualize)
        
        labels = list(region_country_dict.keys())
        print("All regions:", labels)

        country_dict = {str(i): [] for i in range(1, 6)}
        if len(selectedCountries) == 0:
            country_dict['Others'] = []

        for region in labels:
            others_cnt = 0
            j = 0
            for country_name, people_cnt in region_country_dict[region].items():
                if 1 <= j <= 5:
                    country_dict[str(j)].append(people_cnt)
                elif j > 5:
                    others_cnt += people_cnt
                j += 1
            
            if len(selectedCountries) == 0:
                country_dict['Others'].append(others_cnt)
        
        print("country_dict:", country_dict)

        datasets = list()
        color_i = 0
        for country_name, region_wise_cnt in country_dict.items():
            temp_dict = dict()
            temp_dict['data'] = region_wise_cnt
            temp_dict['backgroundColor'] = visa_color_pickers[color_i]['backgroundColor']
            temp_dict['hoverBackgroundColor'] = visa_color_pickers[color_i]['hoverBackgroundColor']
            color_i += 1

            datasets.append(temp_dict)

        return StackedBarData(
            labels = labels,
            datasets = datasets
        )

    return StackedBarData(
        labels = regions,
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