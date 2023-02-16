import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingHandlerService {
  public amounts = [5, 10, 20];
  public times = [15, 30, 45];
  public difficults = ['Any', 'Easy', 'Medium', 'Hard'];
  public categories = new Array();

  constructor() {
    this.categories.push(new Category('Any', 0, '', 'Select from all Catgories!'));
    this.categories.push(new Category('General Knowledge', 9, '', 'Tooltip'));
    this.categories.push(new Category('Entertainment: Books', 10, 'Books', 'Tooltip'));
    this.categories.push(new Category('Entertainment: Film', 11, 'Film & Cinema', 'Tooltip'));
    this.categories.push(new Category('Entertainment: Music', 12, 'Music', 'Tooltip'));
    this.categories.push(new Category('Entertainment: Musicals & Theatres', 13, 'Musicals & Theatres', 'Tooltip'));
    this.categories.push(new Category('Entertainment: Television', 14, 'Television', 'Tooltip'));
    this.categories.push(new Category('Entertainment: Video Games', 15, 'Video Games','Tooltip'));
    this.categories.push(new Category('Entertainment: Board Games', 16, 'Board Games','Tooltip'));
    this.categories.push(new Category('Science & Nature', 17, 'Science & Nature','Tooltip'));
    this.categories.push(new Category('Science: Computers', 18, 'Computer Science','Tooltip'));
    this.categories.push(new Category('Science: Mathematics', 19, 'Mathematics','Tooltip'));
    this.categories.push(new Category('Mythology', 20, '','Tooltip'));
    this.categories.push(new Category('Sports', 21, '','Tooltip'));
    this.categories.push(new Category('Geography', 22, '','Tooltip'));
    this.categories.push(new Category('History', 23, '','Tooltip'));
    this.categories.push(new Category('Politics', 24, '','Tooltip'));
    this.categories.push(new Category('Art', 25, '','Tooltip'));
    this.categories.push(new Category('Celebrities', 26, '','Tooltip'));
    this.categories.push(new Category('Animals', 27, '','Tooltip'));
    this.categories.push(new Category('Vehicles', 28, '','Tooltip'));
    this.categories.push(new Category('Entertainment: Comics', 29, 'Comics','Tooltip'));
    this.categories.push(new Category('Science: Gadgets', 30, 'Gadgets','Tooltip'));
    this.categories.push(
      new Category('Entertainment: Japanese Anime & Manga', 31, 'Anime & Manga','Tooltip')
    );
    this.categories.push(
      new Category('Entertainment: Cartoons & Animations', 32, 'Cartoons & Animation','Tooltip')
    );
  }

  // Gets ID for specific category-name
  getCategoryID(categoryName) {
    for (var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].name == categoryName) return this.categories[i].id;
    }
  }

  // Gets category name for specific id
  getCategoryName(id) {
    for (var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == id) return this.categories[i].name;
    }
  }

  get(categoryName) {
    for (var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].name == categoryName) return this.categories[i];
    }
  }

  generateNumber(name: string): number {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      var char = name.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash % 10);
  }
}

class Category {
  name: string;
  id: number;
  shortenedName: string;
  tooltip: string;

  constructor(name, id, shortenedName, tooltip) {
    this.name = name;
    this.shortenedName = shortenedName;
    if (this.shortenedName == '') this.shortenedName = this.name
    this.id = id;
    this.tooltip = tooltip;
  }
}
