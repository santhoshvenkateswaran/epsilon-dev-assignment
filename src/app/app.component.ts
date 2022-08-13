import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  tableContent: TableContent[] = [];

  readonly tableColumns = ['Product Name', 'Price', 'Category'];

  tableProps = {
    sortOn: 'name',
    sortOder: 'asc'
  };

  isSortActive = (column: string, order: 'asc' | 'desc'): boolean =>
    this.tableProps.sortOder === order && this.tableProps.sortOn === column;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchTableContent();
  }

  private fetchTableContent(): void {
    this.http.get<any>('https://raw.githubusercontent.com/epsilon-ux/code-challenge-resources/main/cookies.json').subscribe({
      next: (response) => {
        if (response?.cookies?.length) {
          this.tableContent = [...response.cookies];
        }
      },
      error: (error) => {
        // TODO: Handle error.
      }
    });
  }

  handleColumnClick(column: string): void {
    if (column === this.tableProps.sortOn) {
      this.tableProps.sortOder = this.tableProps.sortOder === 'asc' ? 'desc' : 'asc';
    } else {
      this.tableProps.sortOn = column;
      this.tableProps.sortOder = 'asc';
    }
    this.sortTable();
  }

  sortTable(): void {
    const { sortOn, sortOder } = this.tableProps;
    switch (sortOn) {
      case 'Price': {
        this.sortPrice(this.tableContent, 'price', sortOder === 'desc');
        break;
      }
      case 'Category': {
        this.sortString(this.tableContent, 'category', sortOder === 'desc');
        break;
      }
      case 'Product Name': {
        this.sortString(this.tableContent, 'name', sortOder === 'desc');
        break;
      }
      default: {
        break;
      }
    }
  }

  private sortPrice<T>(array: T[], key: string, reverse = false): T[] {
    return array.sort((a: any, b: any) => {
      const k1 = Number(a[key].replace('$', ''));
      const k2 = Number(b[key].replace('$', ''));
      if (isNaN(k1) || isNaN(k2)) {
        return 0;
      } else {
        const comparison = k1 - k2;
        return reverse ? comparison * -1 : comparison;
      }
    })
  }

  private sortString<T>(array: T[], key: string, reverse = false): T[] {
    return array.sort((a: any, b: any) => {
      const k1 = a[key].toLowerCase();
      const k2 = b[key].toLowerCase();
      let comparison = 0;
      if (k1 > k2) {
        comparison = 1;
      } else if (k1 < k2) {
        comparison = -1;
      }
      return reverse ? comparison * -1 : comparison;
    })
  }

}

interface TableContent {
  price: string;
  category: string;
  name: string;
}
