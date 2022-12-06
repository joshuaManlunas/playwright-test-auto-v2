import {envTestData} from "./data/data-types";

export interface Publisher {
    addSubscriber(observer: Observer): void
    publishData(data: object): void
}

export interface Observer {
    getDataUpdate(data: object): void
}