((self)=>{
"use strict";

const config = {
     url:    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
,
    localStorage:{
         favoriteKey:"favoritesLocal",
         localProductsKey:"productLocal",
         duration:1*60*60*1000
        },
        offEvents:{}

}


const classes = {
    style:"mrt-ins-custom-style",
    title: "mrt-ins-preview-title",
    infoModal:"mrt-info-modal",
    infoModalContent:"mrt-info-modal-content",
    infoButton:"mrt-info-button",
    infoClose:"mrt-info-close",
    carouselSection:"mrt-carousel-section",
    carouselContainer:"mrt-carousel-container",
    carouselBody:"mrt-carousel-body",
    carouselHeader:"mrt-carousel-header",
    carouselTitle:"mrt-carousel-title",
    carousel:"mrt-carousel",
    previousButton:"mrt-previous-button",
    nextButton:"mrt-next-button",
    productImage:"mrt-product-image",
    carouselProducts:"mrt-carousel-products",
   productLink:"mrt-product-link",
   productItem:"mrt-product-item",
   favIcon:"mrt-fav-icon",
   productInfo:"mrt-product-info",
   productTitle:"mrt-product-title",
   productPrice:"mrt-product-price",
   addCart:"mrt-add-cart",
unfilledFavIcon:"mrt-unfilled-fav-icon", 
filledFavIcon:"mrt-filled-fav-icon"
}

  let products = [];
  let favorites = [];

const selectors = Object.keys(classes).reduce((createdSelector, key) => {
    createdSelector[key] = `.${classes[key]}`;
    return createdSelector;
  }, {});



self.init = () => {
  !window.jQuery ? 
    self.loadJquery() :
    (self.reset(), self.buildCss(),self.fetchProducts(), self.buildHtml(),favorites = self.getFromFavorites(),self.setEvents())
}


self.loadJquery = () => {
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
  script.onload = () => {
    self.init();
  };
  document.head.appendChild(script);
};


  self.reset = () => {
    const { style } = selectors;
    $(style).remove();
  //  $(html).remove()
    Object.keys(config.offEvents).forEach((event) => $(document).off(event));
   }


  self.buildCss = () => {
     const {style,title} = classes
     const {infoModal,infoButton,   infoModalContent,infoClose,carouselSection,carouselContainer,carouselBody,carouselHeader,carouselTitle,carousel,previousButton,nextButton,productImage,carouselProducts,productLink,productItem,favIcon,productInfo,productTitle,productPrice,addCart} = selectors


    const customStyle = `
    <style class="${style}"> 
       
        ${infoModal} {
              position: fixed;
              z-index: 999999;
              top: 0;
              left: 0;
              right:0;
              bottom:0;
              background-color: rgba(0, 0, 0, 0.3);
          }

          ${infoModalContent} {
              background: #fff;
              padding: 25px 30px;    
              justify-content: space-between;  
              border-radius: 5px;
              max-width: 600px;
              top: 50%;
              left: 50%;
              text-align: center;
              transition: display linear 0.2s;
              transform: translateX(-50%) translateY(-50%);
              position: fixed;
              font-family: 'Open Sans', sans-serif;
              color: #333;
          }

          ${infoModalContent} p {
                width: 280px;
                height: 100%;
                flex-grow: 0;
                font-size: 16px;
                line-height: 1.5;
                text-align: center;
                color: #555;
            }

          ${infoButton}{
              all: unset;
              cursor: pointer;
              margin-left:8px
            }

            ${infoClose} {
                min-width: 100%;
                cursor:pointer;
                height: 40px;
                flex-grow: 0;
                border-radius: 5px;
                background-color: #193db0;
                border: none;
                font-size: 16px;
                font-weight: bold;
                line-height: 1.38;
                color: #fff;
            }




      ${carouselSection}{
            display:flex;
            justify-content: center;
            background-color:#f4f5f7;
            font-family: 'Open Sans', sans-serif !important;
        }

        ${carouselContainer}{
          width:80%;
        }
     
        ${carouselBody} {
         position:relative;
        }

       
         ${carouselHeader}{
          display:flex;
          flex-direction:row;
          align-items: center;
          line-height:43px;
          padding:15px 0;   

        }

        ${carouselTitle} {
                font-size: 32px;
                color: #29323b;
                line-height: 43px;
                font-weight: lighter;
                margin:0; 
               font-family: 'Open Sans', sans-serif !important;
            }



            ${carousel} {
            background-color:white;
            display: flex;
            flex-direction: column;
            background-color:#f4f5f7;
            max-width:100%;
            padding:0 0 32px;
            }
            
            
            ${previousButton} {
               position: absolute;
               top: 50%;
              left: -35px;
              transform: translateY(-50%);
              cursor: pointer;
              background-color: transparent;
              border: none;
              }
           
              ${nextButton} {
                position: absolute;  
                top: 50%;
                right: -35px;
                transform: translateY(-50%) rotate(180deg);
                cursor: pointer;
                background-color: transparent;
                border: none;
            }
            


            ${productImage} {
                width: 100%;
            }


            ${carouselProducts}::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            ${carouselProducts} {
                display: flex;
                flex-direction: row;
                gap: 1rem;
                overflow-x: auto;
                scroll-behavior: smooth;
                background-color:#f4f5f7;
                margin:0;
                padding:0;            
                }

            ${productLink} {
            text-decoration: none !important;
            }

            ${productItem} {
                position: relative;
                min-width: 220px;
                background-color:#ffffff;
            }

            ${favIcon} {
                position: absolute;
                top: 6%;
                right: 10%;
                z-index: 200;
                cursor: pointer;
            }

              
            ${productInfo}{
            padding:0 10px
            }

            ${productTitle} {
            color: #302e2b !important;
                font-size: 14px;
                height:40px;
                margin:5px 0 10px;
                cursor:pointer;
            }

            ${productPrice} {
                color: #193db0;
                font-size: 18px;
                display:flex;
                height:50px;
                margin:8px 0;
                align-items: flex-end;
                line-height: 22px;
                font-weight:bold;
            }

             ${addCart}{
                cursor: pointer;
                width: 100%;
                height: 35px;
                flex-grow: 0;
                margin: 10px 0 0;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                border:none;
                background-color: #1f49b6;
                color: #fff;
                border-radius: 5px;
                display: none !important;
             }




                @media (max-width: 990px) {
                   ${addCart} {
                      display: block !important;
                     }

                    ${previousButton}{
                     display: none !important;
                    }

                    ${nextButton}{
                     display: none !important;
                     }
                 
                   ${carouselSection}{
                   justify-content:flex-start;
                   padding:0 15px;
                      }
                   
                      ${carouselTitle}{
                        font-size:24px;
                     }

                     ${infoButton}{
                       height:20px;
                
                     }
                     
                  ${carouselContainer}{
                     width: 100%;
                  }

                  ${productItem} {
                min-width: 280px;
                   }

                 ${productImage}{
                    height: 372.75px;
                    width: 280px;
                   }
                   ${carouselProducts}{
                  gap: 24.38px;
                 }
                }

                 
              @media (max-width: 768px) {
                ${carouselProducts}{
                  gap: 21px;
                 }
               }

              @media (max-width: 576px) {
                ${carouselProducts}{
                  gap: 15px;
                }
              }

              @media (max-width: 408px) {
              ${carouselHeader}{
                  flex-direction: column;
                  align-items: flex-start;
                }
              }
    
    
    </style>

    ` 
  
    $("head").append(customStyle)
}

 self.buildHtml = () => {

       const {infoModal,infoModalContent,infoButton,infoClose,carouselSection,carouselContainer,carouselHeader,carouselTitle,carouselBody,previousButton,carousel,carouselProducts,nextButton,productItem,favIcon,
        unfilledFavIcon,filledFavIcon,productLink,productImage,productInfo,productTitle,productPrice,addCart } = classes 

      const main = `
       <div class="${infoModal}" aria-label="info modülü" style="display:none">
                <div class="${infoModalContent}" aria-label="info content">
                    <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M64.09 32.045c0 17.698-14.347 32.045-32.045 32.045S0 49.743 0 32.045 14.347 0 32.045 0 64.09 14.347 64.09 32.045z" fill="#F0F7FC"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31.898 37.996c-1 0-1.84.839-1.84 1.84 0 1 .84 1.84 1.84 1.84.964 0 1.84-.84 1.796-1.796a1.796 1.796 0 0 0-1.796-1.884z" fill="#1F49B6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M48.926 44.516c1.155-1.995 1.163-4.371.015-6.358L37.417 18.2c-1.14-2.009-3.2-3.201-5.512-3.201-2.31 0-4.37 1.2-5.511 3.194L14.856 38.173a6.332 6.332 0 0 0 .022 6.394 6.297 6.297 0 0 0 5.497 3.157h23.017c2.304 0 4.371-1.2 5.534-3.208zm-2.502-1.443a3.477 3.477 0 0 1-3.039 1.76H20.367a3.43 3.43 0 0 1-3.002-1.723 3.482 3.482 0 0 1-.008-3.51l11.539-19.971a3.415 3.415 0 0 1 3.01-1.744 3.43 3.43 0 0 1 3.01 1.75l11.53 19.972c.618 1.075.611 2.37-.022 3.466z" fill="#1F49B6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31.444 25.081c-.876.25-1.42 1.045-1.42 2.01.044.58.08 1.17.124 1.75l.376 6.601c.044.75.625 1.295 1.376 1.295.75 0 1.34-.58 1.376-1.339 0-.456 0-.876.044-1.34.081-1.42.17-2.84.25-4.26.044-.92.125-1.84.17-2.76 0-.33-.045-.625-.17-.92a1.844 1.844 0 0 0-2.126-1.037z" fill="#1F49B6"></path></svg>            <p>Bu sayfada satın alma verilerine göre ürün detayına gidilen ürün ile birlikte beden bulunurluğu yüksek olan seçili kategori ve ürün tipinde en sık satın alınan LCW markalı ürünler öncelikli olarak gösterilir.</p>
                    <button class="${infoClose}" aria-label="info butonu">TAMAM</button>
                </div>
           </div>


           
         <div class="${carouselSection}">
            <div class="${carouselContainer}">
                
                <div class="${carouselHeader}">
                    <p class="${carouselTitle}" aria-label="ilgini çekebilecek diğer ürünler">İlgini Çekebilecek Diğer Ürünler<button type="button" class="${infoButton}">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.476 0 10s4.477 10 10 10 10-4.476 10-10S15.523 0 10 0zm.002 4.664a1.256 1.256 0 1 1 0 2.511 1.256 1.256 0 0 1 0-2.51zm2.197 10.672H7.805v-1.883h.941V9.686h-.941V7.803h3.453v5.65h.941v1.883z" fill="#1F49B6"></path> </svg>
                      </button>           
                    </p>
                </div>
                 
                <div class="${carouselBody}">
                
                    <button class="${previousButton}" aria-label="öncekine gel butonu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                    </button>
                    
                    <div class="${carousel}">
                        <div class="${carouselProducts}"></div>     
                    </div>
                
                    <button class="${nextButton}" aria-label="sonrakine git butonu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                    </button>
               
                </div>

            </div>
          </div>
      `
  const unfilledFavIcons = `
        <div class="unfilledFavIcon">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none">
            <path fill="#fff" fill-rule="evenodd" stroke="#B6B7B9"
            d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z"
            clip-rule="evenodd"></path>
        </svg>
        </div>`;

    const filledFavIcons = `
        <div class="filledFavIcon">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none">
            <path fill="#193DB0" fill-rule="evenodd"
            d="M18.97 5.449C18.693 2.408 16.54.202 13.847.202c-1.794 0-3.437.965-4.362 2.513C8.57 1.147 6.993.2 5.228.2 2.534.201.382 2.407.106 5.448c-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z"
            clip-rule="evenodd"></path>
        </svg>
        </div>`;




    $(".product-detail").after($(main));

const $carouselProducts = $(`.${classes.carouselProducts}`);


     products.forEach((i) => {
        
      const isFav = favorites.includes(Number(i.id));
      const productItems = $(`
            <div class="${productItem}" aria-label="ürünler">
                <div class="${favIcon} ${
                  isFav ? "filled" : "unfilled"
                }" data-id="${i.id}" style="cursor:pointer;">
                    <div class="${unfilledFavIcon}" style="display: ${
                      isFav ? "none" : "block"
                    }"> ${unfilledFavIcons} </div>
                    <div class="${filledFavIcon}" style="display: ${
                      isFav ? "block" : "none"
                    }">${filledFavIcons}</div>
                </div>
            
                <a class="${productLink}" aria-label="ürün linki" href=${
                  i.url
                } target="_blank">
                     <img class="${productImage}" aria-label="ürün resmi" src="${
                       i.img
                     }" alt="${i.name}">
                </a>

                <div class="${productInfo}">    
                    <a class="${productLink}"  aria-label="ürün linki"  href=${
                      i.url
                    } target="_blank">
                    <p class="${productTitle}"  aria-label="ürün adı"  >${
                      i.name
                    }</p>
                    </a>

                    <p class="${productPrice}"  aria-label="ürünün fiyatı"  >${
                      i.price
                    } TL</p>

                    <button class="${addCart}"  aria-label="sepete ekle butonu" >SEPETE EKLE</button>
                </div>
            </div>
      `);
  $carouselProducts.append(productItems);
    });


 }


self.setEvents = () => {
    const { carouselProducts, previousButton, nextButton, infoButton, infoClose, favIcon, filledFavIcon, unfilledFavIcon, addCart } = selectors;

    const $scrollContainer = $(`${carouselProducts}`);
    const scrollAmount = $scrollContainer[0].clientWidth / 2;
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse drag ile kaydırma
    $scrollContainer.on("mousedown", function (e) {
        isDown = true;
        startX = e.pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
    });

    $scrollContainer.on("mouseleave mouseup", function () {
        isDown = false;
    });

    $scrollContainer.on("mousemove", function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - this.offsetLeft;
        const walk = x - startX;
        this.scrollLeft = scrollLeft - walk;
    });

    // Scroll butonları
    $(previousButton).on("click", () => {
        $scrollContainer[0].scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    $(nextButton).on("click", () => {
        $scrollContainer[0].scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Info modal
    $(document).on("click", infoButton, () => {
        $(".infoModal").show();
    });

    $(document).on("click", infoClose, () => {
        $(".infoModal").hide();
    });

    // Favorilere ekle/çıkar
    $scrollContainer.on("click", favIcon, function (e) {
        e.stopPropagation(); // ürün click olayını engelle
        const id = Number($(this).data("id"));
        const isFav = favorites.includes(id);

        if (isFav) {
            self.removeFromFavorites(id);
            $(this).removeClass("filled").addClass("unfilled");
            $(this).find(filledFavIcon).hide();
            $(this).find(unfilledFavIcon).show();
        } else {
            self.saveToFavorites(id);
            $(this).removeClass("unfilled").addClass("filled");
            $(this).find(unfilledFavIcon).hide();
            $(this).find(filledFavIcon).show();
        }
    });

    // Sepete ekle butonu
    $(document).on("click", addCart, function (e) {
        e.stopPropagation();
        alert("Ürün sepetinize başarıyla eklendi.");
        console.log("ürün sepete eklendi");
    });
};

 //Business Logics ve Fonksiyonlar
  self.fetchProducts = async () => {
    try {
      const localData =  self.getFromLocal();

      if (localData && localData.length) {
        products = localData;
        console.log("localden veriler yüklendi: ", localData);
      } else {
        const res = await fetch(config.url);
        const data = await res.json();

        self.saveToLocal(data);
        products = data;

        console.log("veriler apiden çekildi.", data);
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      console.log("işlem tamam");
    }
  };

   self.saveToLocal = (data) => {
    const dataWithTime = {
      data: data,
      timestamp: Date.now(),
    };
    localStorage.setItem(config.localStorage.localProductsKey, JSON.stringify(dataWithTime));
  };

   self.getFromLocal = () => {
    const localData = localStorage.getItem(config.localStorage.localProductsKey);
    if (!localData) return null;

    const parse = JSON.parse(localData);
    if (Date.now() - parse.timestamp < config.localStorage.duration) {
      return parse.data;
    } else {
      localStorage.removeItem(config.localStorage.localProductsKey);
      return null;
    }
  };

   self.saveToFavorites = (id) => {
    if (!favorites.includes(Number(id))) {
      favorites.push(Number(id));
      localStorage.setItem(config.localStorage.favoriteKey, JSON.stringify(favorites));
    }
  };

  self.getFromFavorites = () => {
    return JSON.parse(localStorage.getItem(config.localStorage.favoriteKey)) || [];
  };

  self.removeFromFavorites = (id) => {
    favorites = favorites.filter((favId) => favId !== Number(id));
    localStorage.setItem(config.localStorage.favoriteKey, JSON.stringify(favorites));
  };


self.init()

})({})