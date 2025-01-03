document.addEventListener("DOMContentLoaded", createSelect, false);

function createSelect() {
  var select = document.getElementsByTagName("select"),
      liElement,
      ulElement,
      optionValue,
      iElement,
      optionText,
      selectDropdown,
      elementParentSpan;

  for (var selectIndex = 0, len = select.length; selectIndex < len; selectIndex++) {
    //console.log('selects init');

    select[selectIndex].style.display = "none";
    wrapElement(
        document.getElementById(select[selectIndex].id),
        document.createElement("div"),
        selectIndex,
        select[selectIndex].getAttribute("placeholder-text")
    );

    for (var i = 0; i < select[selectIndex].options.length; i++) {
      liElement = document.createElement("li");
      optionValue = select[selectIndex].options[i].value;
      optionText = document.createTextNode(select[selectIndex].options[i].text);
      liElement.className = "select-dropdown__list-item";
      liElement.setAttribute("data-value", optionValue);
      liElement.appendChild(optionText);
      ulElement.appendChild(liElement);

      liElement.addEventListener(
          "click",
          function () {
            displyUl(this);
          },
          false
      );
    }
  }
  function wrapElement(el, wrapper, i, placeholder) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    document.addEventListener("click", function (e) {
      let clickInside = wrapper.contains(e.target);
      if (!clickInside) {
        let menu = wrapper.getElementsByClassName("select-dropdown__list");
        menu[0].classList.remove("active");
      }
    });

    var buttonElement = document.createElement("button"),
        spanElement = document.createElement("span"),
        spanText = document.createTextNode(placeholder);
    iElement = document.createElement("i");
    ulElement = document.createElement("ul");

    wrapper.className = "select-dropdown select-dropdown--" + i;
    buttonElement.className =
        "select-dropdown__button select-dropdown__button--" + i;
    buttonElement.setAttribute("data-value", "");
    buttonElement.setAttribute("type", "button");
    spanElement.className = "select-dropdown select-dropdown--" + i;
    iElement.className = "zmdi zmdi-chevron-down";
    ulElement.className = "select-dropdown__list select-dropdown__list--" + i;
    ulElement.id = "select-dropdown__list-" + i;

    wrapper.appendChild(buttonElement);
    spanElement.appendChild(spanText);
    buttonElement.appendChild(spanElement);
    buttonElement.appendChild(iElement);
    wrapper.appendChild(ulElement);
  }

  function displyUl(element) {
    if (element.tagName == "BUTTON") {
      selectDropdown = element.parentNode.getElementsByTagName("ul");
      //var labelWrapper = document.getElementsByClassName('js-label-wrapper');
      for (var i = 0, len = selectDropdown.length; i < len; i++) {
        selectDropdown[i].classList.toggle("active");
        //var parentNode = $(selectDropdown[i]).closest('.js-label-wrapper');
        //parentNode[0].classList.toggle("active");
      }
    } else if (element.tagName == "LI") {
      var selectId =
          element.parentNode.parentNode.getElementsByTagName("select")[0];
      selectElement(selectId.id, element.getAttribute("data-value"));
      elementParentSpan =
          element.parentNode.parentNode.getElementsByTagName("span");
      element.parentNode.classList.toggle("active");
      elementParentSpan[0].textContent = element.textContent;
      elementParentSpan[0].parentNode.setAttribute(
          "data-value",
          element.getAttribute("data-value")
      );
    }
  }
  function selectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
    element.setAttribute("selected", "selected");
  }
  var buttonSelect = document.getElementsByClassName("select-dropdown__button");
  for (var i = 0, len = buttonSelect.length; i < len; i++) {
    buttonSelect[i].addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          displyUl(this);
        },
        false
    );
  }
}

const navForm = document.querySelector(".nav_items_form");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    navForm.classList.add("hidden");
  } else {
    navForm.classList.remove("hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".gallery-item");

  const updateVisibility = () => {
    items.forEach((item) => {
      const isFront = item.classList.contains("gallery-item-2");
      const h2 = item.querySelector(".main_wrapper_head");
      const btn = item.querySelector(".main_wrapper_btn");

      if (isFront) {
        h2.style.display = "block";
        btn.style.display = "flex";
      } else {
        h2.style.display = "none";
        btn.style.display = "none";
      }
    });
  };

  // Initial visibility update
  updateVisibility();

  setInterval(() => {
    // Rotate the classes
    items.forEach((item) => {
      if (item.classList.contains("gallery-item-1")) {
        item.classList.replace("gallery-item-1", "gallery-item-3");
      } else if (item.classList.contains("gallery-item-2")) {
        item.classList.replace("gallery-item-2", "gallery-item-1");
      } else if (item.classList.contains("gallery-item-3")) {
        item.classList.replace("gallery-item-3", "gallery-item-2");
      }
    });

    // Update visibility after rotation
    updateVisibility();
  }, 2500); // Adjust the interval as needed






  /*Carousel */

  const slides = document.querySelectorAll('.events_1'),
      slidesWrapper = document.querySelector('.picks_events'),
      sliderField = document.querySelector('.pics_events_field'),
      width = getComputedStyle(slidesWrapper).width, //650px
      prev = document.querySelector('#previous'),
      next = document.querySelector('#next');

  let offset = 0;

  sliderField.style.width = 100 * slides.length + '%';

  sliderField.style.display = 'flex';
  sliderField.style.transition = '0.5s ease';
  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = width;
  });


  next.addEventListener('click', () => {
    // Logic for sliding
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }
    sliderField.style.transform = `translateX(-${offset}px)`;

    // Add the 'clicked' class to the button
    next.classList.add('clicked');
    prev.classList.remove('clicked');
  });

  prev.addEventListener('click', () => {
    // Logic for sliding
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
    sliderField.style.transform = `translateX(-${offset}px)`;

    // Add the 'clicked' class to the button
    prev.classList.add('clicked');
    next.classList.remove('clicked');
  });

});
