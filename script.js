'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const images = document.querySelectorAll('.features__img');
console.log(images);

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////
///implementing smooth scroll
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', e => {
  const s1cordinates = section1.getBoundingClientRect();
  // console.log(s1cordinates);
  // console.log(e.target.getBoundingClientRect());

  // //get current scroll to postions
  // console.log('current scroll to (X/Y)', window.pageXOffset, pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //scrrolling to section 1 when the button is pressed. s1cordinate.top is relative to the viewport so it will create problems
  // window.scrollTo(
  //   s1cordinates.left + window.pageXOffset,
  //   s1cordinates.top + window.pageYOffset
  // );

  //old way
  // window.scrollTo({
  //   left: s1cordinates.left + window.pageXOffset,
  //   top: s1cordinates.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //new way of scrolling now. which is very cool. only works in modern browsers though so watch out
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

///////////////////////////////////
//IMPLEMENTING PAGE NAVIGATION
//implementing without using event delagation
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', e => {
//     e.preventDefault();
//     const destination = el.getAttribute('href');
//     const section = document.querySelector(destination);
//     section.scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

//implementing with event delagation
//1. add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  //2.determine which element originated the event
  // e.target()

  //3. matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////
//IMPLEMENTING THE TAB COMPONENT
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //guard clause
  if (!clicked) return;

  //remove active class from all the buttons
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  //add the active class to the clicked element
  clicked.classList.add('operations__tab--active');

  //remove the active class from all content
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////
//Implementing menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').firstElementChild;
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};
// nav.addEventListener('mouseover', e => {
//   handleHover(e, 0.5);
// });

// nav.addEventListener('mouseout', e => {
//   handleHover(e, 1);
// });

//OR we can do that using the bind method. the bind method will create another function and set the this keyword to the first argument passed.

//the method below will set the this keywword to 0.5 and 1 respectively. in an event listener, the this keyword is the current target

//passing arguments in handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

////////////////////////////////////////////
//Implementing sticky navigation

//FIRST OPTION
// const intitialCords = section1.getBoundingClientRect().top;
// window.addEventListener('scroll', e => {
//   if (window.scrollY > intitialCords) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

//OR THE BEST OPTION==INTERSECTION OBSERVER API// THE INTERSECTIONN OBSERVER API (second option); we want to set the API to when the header is out of view

//create the call back function
const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
//select the header
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//call the API
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
//observe the header.
headerObserver.observe(header);

/////////////////////////////////////
/////IMPLEMENTING REVEAL SECTIONS

const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  //BECAUSE THE TARGET CONTINUES TO BE OBSERVED ANYTIME WE SCROLL EVEN AFTER THE WORK IS DONE. WE NEED TO OBSERVE AFTER
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  // rootMargin: '-30px',
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

////////////////////////////////
///////////IMPLEMENTING LAZY LOADING IMAGES
const revealImage = (entries, observer) => {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  //REPLACE SRC WITH DATA-SRC
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

images.forEach(image => {
  imageObserver.observe(image);
});

//////////////////////////////////////
////////////////IMPLEMENTING THE SLIDER

const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  const slider = document.querySelector('.slider');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = () => {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class ="dots__dot" data-slide= ${i}></button>`
      );
    });
  };

  const activateDot = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide ="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = () => {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = () => {
    createDots();
    goToSlide(0);
    activateDot(0);
  };

  init();

  //EVENT LISTENERS
  //Next Slide
  btnRight.addEventListener('click', nextSlide);

  //prev Slide
  btnLeft.addEventListener('click', prevSlide);

  //keyboard Events *(arrow right and arrow left)
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      activateDot(curSlide);
    }
    e.key === 'ArrowLeft' && prevSlide();
    activateDot(curSlide); //short circuting/ the AND opearator taps out when the first value is false, if not it moves to the second value. if the second value is true too,it executes the second value and that's what happened there.
  });

  /////////Implementing the dots functionality in the slide
  dotsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// 0%, 100%, 200%, 300%

//LECTURE

///SECLECTING ELEMENTS
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const headerEl = document.querySelector('.header');
// console.log(headerEl);
// const allSections = document.querySelectorAll('section');
// console.log(allSections);

// document.getElementById('section-1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

//document,getElement(s).id/tagName.ClassName will return a HTMLcollection. hoever, query SelectorALL will return a nodeLIst.  the HTMLcollection is a live collection whereby a change in the DOM will be immediately updated automatically in the HTML collection. this doesnt happen with node List

//CREATING AND INSERTING ELEMENTS
//1.
// insertAdjacentHTML(); //we already discussed it in the bankist app

//2.
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent ='we use cookies for improved functionality and analytics'
// message.innerHTML = `we use cookies for improved functionality and analytics <button class="btn btn--close--cookies">Got it</button>`;
// message.style.cursor = 'pointer';

// headerEl.prepend(message);
// headerEl.append(message);

// headerEl.append(message.cloneNode(true));
// console.log(headerEl);

// headerEl.before(message); //befrore the header element
// headerEl.after(message); //after the header element

// document.querySelector('.btn--close--cookies').addEventListener('click', () => {
//   message.remove();
//   // message.parentElement.removeChild(message)//how it was done before the remove method came and this is called DOM transversing
// });

// //STYLES, ATTRIBUTES AND CLASSES

// //STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.backgroundColor);
// console.log(message.style.color);

// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).fontSize);
// console.log(getComputedStyle(message).height);

// //increasing the styling
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// console.log(message.style.height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //ATTRIBUTES. they include src, alt, class, id, href etc
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// logo.alt = 'Beautiful Minimalist Logo'; //will reset the alt;
// console.log(logo.alt);
// logo.setAttribute('company', 'bankist');

// console.log(logo.src); //absolute source
// console.log(logo.getAttribute('src')); //relative source

// const link = document.querySelector('.twitter-link');
// console.log(link.href);
// console.log(link.getAttribute('link'));

// //data attributes
// console.log(logo.dataset.versionNumber);

// //classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');
// logo.className = 'jonas'; //don't use thhis because this will overide any existing classes and allow us to set only one class on any element

// //non-standard attribute
// console.log(logo.designer); //undefined
// console.log(logo.getAttribute('designer')); //sucessful
// console.log(logo.getAttribute('isTRU')); //sucessful

//TYPES OF EVENTS AND EVENT HANDLERS
// const h1 = document.querySelector('h1');

// const alertfxn = () => {
//   alert('addEventListener: Great! You are reading the heading 😊');
// };
// h1.addEventListener('mouseenter', alertfxn);

// setTimeout(() => h1.removeEventListener('mouseenter', alertfxn), 3000);

// h1.onmouseenter = () => {
//   alert('onmouseenter: Great! You are reading the heading 😊');
// };

//CAPTURING AND BUBBLING PHASES OF EVENTS

//EVENT PROPAGATION IN PRACTISE(BUBBLING and TARGET phase MAINLY)
// const rand = () => {
//   const r = Math.trunc(Math.random() * 255) + 1;
//   const g = Math.trunc(Math.random() * 255) + 1;
//   const b = Math.trunc(Math.random() * 255) + 1;
//   return `rgb(${r},${g},${b})`;
// };
// console.log(rand());

// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // e.stopPropagation(); //stop propagatin will stop event bubbling but it's really not a good practise to stop the propagation
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('container', e.target, e.currentTarget);
// });

// // document.querySelector('.nav').addEventListener('click', function (e) {
// //   this.style.backgroundColor = randomColor();
// //   console.log('nav', e.target, e.currentTarget);
// // });

// //CAPTURING PHASE/ EVENTS ARE CAPTURED WHEN THEY COME DOWN FROM THE DOCUMENT ROOT TO THE TARGET ELEMENT
// //TO HANDLE EVENTS AT THE CAPTURING PHASE, WE WILL NEED TO ADD A THIRD PAREMETER IN THE ADD EVENT LISTENER WHICH IS EITHER TRUE OR FALSE. when it is set to true, the event will no longer listen to bubbling phase but to capturing phase(it  goes down)

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('nav', e.target, e.currentTarget);
//   },
//   false //default
// );

//DOM TRAVERSING
// const h1 = document.querySelector('h1');

// //GOING DOWNWARD: CHILD

// //1. query selector
// // h1.querySelectorAll('.highlight').forEach(el => console.log(el.textContent));
// console.log(h1.querySelectorAll('.highlight'));

// //2. CHILD NODES
// console.log(h1.childNodes);

// //3. CHILDREN
// console.log(h1.children);

// //4. FIRST ELEMENTCHILD
// console.log((h1.firstElementChild.style.color = 'red'));

// //5. Last ELEMENTCHILD
// console.log(h1.lastElementChild);

// //GOING UPWARDS: PARENTS
// //1. ParentNode. it returns the parent of the element. works the same as parentElement
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //2. closest== will return the close parent to the element depending on what is inputed
// h1.closest('.header').style.background = `var(--gradient-secondary)`;

// h1.closest('h1'); //will return the h1 itself. it's the opposite of querySelector. querySelector finds children no matter how deeep in the DOM tree while closest finds parent no matter how far in the DOM TREE

// //GOING SIDEWAYS--SIBLINGS
// //we can only access direct siblings in js, i.e siblings with the same parent

// //1. PreviousElementSibling
// console.log(h1.previousElementSibling); //null

// //2 nextElementSibling
// console.log(h1.nextElementSibling); //h4

// //we also have the same method for nodes
// //3 nextSibling
// console.log(h1.nextSibling);

// //4 previousSibling
// console.log(h1.previousSibling);

// //if we want to get all the children
// console.log(h1.parentElement.children); //and it will include itself

// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(0.5)s';
// });

// THE INTERSECTIONN OBSERVER API ---HOW IT WORKS
// const obsCallBackFxn = (entries, observer) => {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsObj = {
//   root: null,
//   threshold: [0, 0.2],
// };
// //the API takes 2 arguements, a callback function and an object of options
// const observer = new IntersectionObserver(obsCallBackFxn, obsObj);
// observer.observe(section1);

/////////////////////////////////////////
////LIFYCLE DOM EVENTS
//1. DOMContentLoaded===happens on the document
// document.addEventListener('DOMContentLoaded', e => {
//   console.log('HTML Parsed and DOM tree built', e);
// });

// //2. LOAD EVENTS====happens onthe window
// window.addEventListener('load', e => {
//   console.log('page fully loaded', e);
// });

//3.  window.addEventListener('beforeunload', e => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

/////////////////////////////////
//EFFICIENT SCRIPT LOADING: DEFER AND ASYNC
