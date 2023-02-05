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
    death_by_days: dict = {}

    def set_covid_path(self, path: str):
        self.covid_data_path = Path(path)

    def set_covid_data(self, force: bool = False):
        if force or not self.covid_data:
            self.covid_data = read_data_from_json(self.covid_data_path.name)

    # Elaboro i dati relativi alle morti per giorno
    def set_death_by_days_data(self, force: bool = False):
        if force or not self.death_by_days:
            self.set_covid_data()
            self.death_by_days = {}
            # Prendo TUTTI i valore Json
            for state, item in self.covid_data.items():
                # Seleziono DATA dentro ITEM
                for data in item['data']:
                    # Se non c'è la data, metto 0
                    if data['date'] not in self.death_by_days:
                        self.death_by_days[data['date']] = 0
                    # Se non c'è la new deaths, metto 0
                    if not data.get('new_deaths'):
                        data['new_deaths'] = 0
                    self.death_by_days[data['date']] = self.death_by_days[data['date']] + data['new_deaths']
            # Ordino per data
            self.death_by_days = dict(sorted(self.death_by_days.items(), key=lambda x: x[0], reverse=False))

    def create_death_by_days_csv(self, path: str):
        self.set_death_by_days_data()
        # Creo il l'oggetto CsvHelper
        csv_helper = CsvHelper()
        # Scrive l'header del CSV
        csv_helper.set_header(['date', 'value'])
        # Scrive le righe nel CSV
        for date, value in self.death_by_days.items():
            csv_helper.add_row([date, value])
        # Salvo il file csv
        csv_helper.save_file(path)

        def create_full_csv(self, path: str):
            self.set_covid_data()
            # Creo il l'oggetto CsvHelper
            csv_helper = CsvHelper()
            # Indica se devo scrivere l'intestazione del CSV
            # write_header = True

            death_by_days = {}
            # Prendo TUTTI i valore Json
            for state, item in self.covid_data.items():
                # Seleziono DATA dentro ITEM
                for data in item['data']:
                    # Se non c'è la data, metto 0
                    if data['date'] not in death_by_days:
                        death_by_days[data['date']] = 0
                    # Se non c'è la new deaths, metto 0
                    if not data.get('new_deaths'):
                        data['new_deaths'] = 0
                    death_by_days[data['date']] = death_by_days[data['date']] + data['new_deaths']
                # if write_header:
                #    write_header = False
                #    csv_helper.set_header(item['properties'])

                # Scrive le righe nel CSV
            # csv_helper.add_row(item['properties'].values())
            # Salvo il file csv
            # csv_helper.save_file(path)


if __name__ == '__main__':
    temp_json = read_data_from_json('owid-covid-data.json')
    temp_csv = read_data_from_csv('owid-covid-data.csv')

    # Path del file
    covid_path = Path('owid-covid-data.json')

    # Istanzio l'oggetto CovidDataHelper
    covid_data_helper = CovidDataHelper()

    # Imposto i path del file
    covid_data_helper.set_covid_path(covid_path.name)

    # Creo CSV con la lista dei nomi e il numero di alberi
    covid_data_helper.create_death_by_days_csv('csv/' + covid_path.stem + '_death_by_days')
