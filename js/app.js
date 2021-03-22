/**
 * Udacity Landing Page Project - by Ahmad Adel Eldardiry - 22/03/2021
*/
// Global function / class that returns an object to use to initialize the required functionality
const LP = (()=> {
    // global properties
    // ul element
    const ul = document.querySelector('#navbar__list');
    // all sections
    const sections = document.querySelectorAll('section');
    // variable to store the current active section
    let activeSection;
    let activeLink;

    // private method to be called by the intersection observer when the target section is into viewport
    const onIntoView = (targets, observer) => {
        // loop through targets
        for(const trg of targets) {
            if(trg && trg.isIntersecting) {
                // a section is intersecting now with the viewport
                if(activeSection) {
                    // activeSection already defined -> remove the class from the current active section
                    activeSection.classList.remove('active-section');
                }
                // add the active class to the new in-view section
                trg.target.classList.add('active-section');
                // assign the new section to activeSection variable
                activeSection = trg.target;
                //
                // set relevant menu item active state
                const lnk = document.querySelector('li.menu__link[data-nav="'+activeSection.getAttribute('data-nav')+'"]');
                if(activeLink) {
                    // activeLink already defined -> remove the class from the current active item
                    activeLink.classList.remove('menu__link__active');
                }
                // add the active class to the new menu item
                lnk.classList.add('menu__link__active');
                // update activeLink variable with the new active item
                activeLink = lnk;
                //
                // no need to loop over te rest -> exit function
                return;
            }
        }
    }

    // private method to build the menu
    const menu = ()=> {
        // use a fragment object to hold the list items to help improve the performance
        const frg = document.createDocumentFragment();
        // loop through all sections to build list items from sections' data-nav attributes
        sections.forEach((sct)=> {
            const li = document.createElement('li');
            li.setAttribute('class', 'menu__link');
            const dataNav = sct.getAttribute('data-nav');
            li.setAttribute('data-nav', dataNav);
            li.textContent = dataNav;
            frg.appendChild(li);
        });
        // append the fragment object to ul element once
        ul.appendChild(frg);
        // assign one listener function to the ul element instead of one for each item's anchor
        // and retrieve the current clicked anchor from the event object to improve performance
        ul.addEventListener('click', (e)=> {
            // get target section from data-nav attribute depending on clicked anchor text
            const sct = document.querySelector('section[data-nav="'+e.target.textContent+'"]');
            if(sct) {
                // smoothly scroll the target section into view
                sct.scrollIntoView({behavior: "smooth"});
            }
        });
    }
    // the object returned from the global function
    return {
        // initialization public method - takes a window object as parameter
        init: (wnd) => {
            // use IntersectionObserver class t monitor sections intersection with the viewport 
            // instead of window scroll event for better efficiency and performance 
            const obs = new IntersectionObserver(onIntoView, {threshold: [0.75, 1]});
            // begin observing all sections
            for(const sct of sections) {
                obs.observe(sct);
            }
            // build the menu
            menu();
            //
            // use the window scroll event with a setTimeout function to detect non-scrolling state and show / hide the menu accordingly
            // use passive : true for better scrolling performance
            //
            // a variable to hold the state of non-scrolling event
            let notScrolling;
            wnd.addEventListener('scroll', ()=> {
                wnd.clearTimeout(notScrolling);
                ul.classList.add('hide-nav');
                notScrolling = setTimeout(()=> { ul.classList.remove('hide-nav'); }, 100);
            }, {passive: true});
            //
            //back to top button
            document.querySelector('#back-to-top').addEventListener('click', ()=> { wnd.scrollTo({top: 0, left: 0, behavior: 'smooth' }); }, false);
        }
    }
})();
//
// initialize the global landig page object wit a window argument
LP.init(window);
