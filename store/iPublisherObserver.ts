import {envTestData} from "./data-types";

export interface Publisher {
    addSubscriber(observer: Observer): void
    publishData(data: object): void
}

export interface Observer {
    getDataUpdate(data: envTestData): void
}