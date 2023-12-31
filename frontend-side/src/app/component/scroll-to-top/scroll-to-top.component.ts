import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 0) {
      let scrollToTopBtn = document.getElementById('scrollToTopBtn');
      if (scrollToTopBtn) {
        scrollToTopBtn.style.display = 'block';
      }
    } else {
     let scrollToTopBtn = document.getElementById('scrollToTopBtn');
     if(scrollToTopBtn)
       scrollToTopBtn.style.display = 'none'
    }
  }

  scrollToTop() {
    let scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      scrollToTopBtn.style.display = 'none';
    }
  }
}
