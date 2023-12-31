

export class Page {
  constructor(entities: any[], total: number, currentPage: number, totalPages: number) {
  this.entities = entities;
  this.total = total;
  this.currentPage = currentPage;
  this.totalPages = totalPages;
}

  entities: any[];
  total: number;
  currentPage: number;
  totalPages: number;

}
