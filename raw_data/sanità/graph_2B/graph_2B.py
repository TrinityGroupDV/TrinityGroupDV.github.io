import array
import csv
import json
from pathlib import Path
from shapely.geometry import shape, Point


def read_data_from_json(path: str):
    # Apro uno stream sul file da leggere
    stream = open(path, 'r')
    # Leggo il file come JSON
    data = json.load(stream)
    # Chiudo lo stream del file
    stream.close()
    return data


def read_data_from_csv(path: str):
    # Apro uno stream sul file da leggere
    stream = open(path, 'r')
    data = []
    # Apro un reader CSV
    reader = csv.DictReader(stream)
    for row in reader:
        data.append(row)
    # Chiudo lo stream del file
    stream.close()
    return data


def sum_dict_data(data: dict, item: dict, key: str):
    if not data.get(key):
        data[key] = 0
    if not item.get(key):
        item[key] = 0
    data[key] = data[key] + item[key]


class CsvHelper:
    def __init__(self):
        self.rows = []
        self.header = []

    def set_header(self, header: array):
        self.header = header

    def set_rows(self, row: array):
        self.rows = row

    def add_row(self, row: array):
        self.rows.append(row)

    def save_file(self, name: str, delimiter: str = ',', lineterminator: str = "\n"):
        # Definisco il path del file
        path = Path(name).with_suffix('.csv')
        # Apro uno stream sul file da scrivere
        stream = open(path, 'w')
        # Creo il writer CSV
        writer = csv.writer(stream, delimiter=delimiter, lineterminator=lineterminator)
        # Scrivo l'intestazione
        if self.header:
            writer.writerow(self.header)
        # Scrivo le righe
        for row in self.rows:
            writer.writerow(row)
        # Chiudo lo stream del file
        stream.close()


class CovidDataHelper:
    # Nomi dei file JSON
    covid_path: Path = None

    # Dati estratti dal JSON
    covid_data: dict = {}

    # Dati eleborati dal JSON
    stats_by_days: dict = {}

    def set_covid_path(self, path: str):
        self.covid_path = Path(path)

    def set_covid_data(self, force: bool = False):
        if force or not self.covid_data:
            self.covid_data = read_data_from_json(self.covid_path.name)

    def set_stats_by_days_data(self, only_europe: bool, force: bool = False):
        if force or not self.stats_by_days:
            self.set_covid_data()
            self.stats_by_days = {}
            # Prendo TUTTI i valore Json
            for state, item in self.covid_data.items():
                if not only_europe or (item.get('continent') and item["continent"] == "Europe"):
                    # Seleziono DATA dentro ITEM
                    for data in item['data']:
                        # Inizializzo struttura dati
                        if data['date'] in self.stats_by_days:
                            total_stats = self.stats_by_days[data['date']]
                        else:
                            total_stats = {}
                        # Sommo i dati
                        sum_dict_data(total_stats, data, "new_deaths_smoothed")
                        sum_dict_data(total_stats, data, "new_cases_smoothed_per_million")
                        sum_dict_data(total_stats, data, "icu_patients")
                        sum_dict_data(total_stats, data, "new_vaccinations_smoothed_per_million")
                        # Imposto i dati
                        self.stats_by_days[data['date']] = total_stats
            # Ordino per data
            self.stats_by_days = dict(sorted(self.stats_by_days.items(), key=lambda x: x[0], reverse=False))

    def create_death_by_days_csv(self, path: str):
        self.set_stats_by_days_data(False)
        # Creo il l'oggetto CsvHelper
        csv_helper = CsvHelper()
        # Scrive l'header del CSV
        csv_helper.set_header(['date', 'value'])
        # Scrive le righe nel CSV
        for date, value in self.stats_by_days.items():
            csv_helper.add_row([date, value['new_deaths_smoothed']])
        # Salvo il file csv
        csv_helper.save_file(path)

    def create_stats_europe_by_days_csv(self, path: str):
        self.set_stats_by_days_data(True)
        # Creo il l'oggetto CsvHelper
        csv_helper = CsvHelper()
        # Scrive l'header del CSV
        csv_helper.set_header(['date', 'death', 'cases', 'icu', 'vaccines'])
        # Scrive le righe nel CSV
        for date, value in self.stats_by_days.items():
            csv_helper.add_row([
                date,
                value['new_deaths_smoothed'],
                value['new_cases_smoothed_per_million'],
                value['icu_patients'],
                value['new_vaccinations_smoothed_per_million']
            ])
        # Salvo il file csv
        csv_helper.save_file(path)

if __name__ == '__main__':
    # Path del file
    covid_path = Path('owid-covid-data.json')

    # Istanzio l'oggetto CovidDataHelper
    covid_data_helper = CovidDataHelper()

    # Imposto i path del file
    covid_data_helper.set_covid_path(covid_path.name)

    # covid_data_helper.create_death_by_days_csv('../../csv/' + 'graph_1A')
    covid_data_helper.create_death_by_days_csv('../../csv/' + 'graph_2B_2E')
