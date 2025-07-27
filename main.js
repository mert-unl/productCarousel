(() => {
  const URL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

  const FAVORITES_KEY = "favoritesLocal";
  const LOCALPRODUCTS_KEY = "productsLocal";
  const DURATION = 1 * 60 * 60 * 1000;

  let products = [];
  let favorites = [];

  const addJquery = (callback) => {
    if (window.jQuery) {
      callback();
    } else {
      let script = document.createElement("script");
      script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    }
  };

  const init = () => {
    addJquery(() => {
      favorites = getFromFavorites();
      fetchProducts();
      buildCSS();
    });
  };

  const buildHTML = () => {
    const html = $(`
           <div class="infoModal" aria-label="info modülü" style="display:none">
                <div class="infoModalContent" aria-label="info content">
                    <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M64.09 32.045c0 17.698-14.347 32.045-32.045 32.045S0 49.743 0 32.045 14.347 0 32.045 0 64.09 14.347 64.09 32.045z" fill="#F0F7FC"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31.898 37.996c-1 0-1.84.839-1.84 1.84 0 1 .84 1.84 1.84 1.84.964 0 1.84-.84 1.796-1.796a1.796 1.796 0 0 0-1.796-1.884z" fill="#1F49B6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M48.926 44.516c1.155-1.995 1.163-4.371.015-6.358L37.417 18.2c-1.14-2.009-3.2-3.201-5.512-3.201-2.31 0-4.37 1.2-5.511 3.194L14.856 38.173a6.332 6.332 0 0 0 .022 6.394 6.297 6.297 0 0 0 5.497 3.157h23.017c2.304 0 4.371-1.2 5.534-3.208zm-2.502-1.443a3.477 3.477 0 0 1-3.039 1.76H20.367a3.43 3.43 0 0 1-3.002-1.723 3.482 3.482 0 0 1-.008-3.51l11.539-19.971a3.415 3.415 0 0 1 3.01-1.744 3.43 3.43 0 0 1 3.01 1.75l11.53 19.972c.618 1.075.611 2.37-.022 3.466z" fill="#1F49B6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31.444 25.081c-.876.25-1.42 1.045-1.42 2.01.044.58.08 1.17.124 1.75l.376 6.601c.044.75.625 1.295 1.376 1.295.75 0 1.34-.58 1.376-1.339 0-.456 0-.876.044-1.34.081-1.42.17-2.84.25-4.26.044-.92.125-1.84.17-2.76 0-.33-.045-.625-.17-.92a1.844 1.844 0 0 0-2.126-1.037z" fill="#1F49B6"></path></svg>            <p>Bu sayfada satın alma verilerine göre ürün detayına gidilen ürün ile birlikte beden bulunurluğu yüksek olan seçili kategori ve ürün tipinde en sık satın alınan LCW markalı ürünler öncelikli olarak gösterilir.</p>
                    <button class="infoClose" aria-label="info butonu">TAMAM</button>
                </div>
           </div>


           
         <div class="carouselSection">
            <div class="carouselContainer">
                
                <div class="carouselHeader">
                    <p class="carouselTitle" aria-label="ilgini çekebilecek diğer ürünler">İlgini Çekebilecek Diğer Ürünler<button type="button" class="infoButton">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.476 0 10s4.477 10 10 10 10-4.476 10-10S15.523 0 10 0zm.002 4.664a1.256 1.256 0 1 1 0 2.511 1.256 1.256 0 0 1 0-2.51zm2.197 10.672H7.805v-1.883h.941V9.686h-.941V7.803h3.453v5.65h.941v1.883z" fill="#1F49B6"></path> </svg>
                      </button>           
                    </p>
                </div>
                 
                <div class="carouselBody">
                
                    <button class="previousButton" aria-label="öncekine gel butonu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                    </button>
                    
                    <div class="carousel">
                        <div class="carouselProducts"></div>     
                    </div>
                
                    <button class="nextButton" aria-label="sonrakine git butonu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
                    </button>
               
                </div>

            </div>
          </div>
            `);

    const unfilledFavIcon = `
        <div class="unfilledFavIcon">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none">
            <path fill="#fff" fill-rule="evenodd" stroke="#B6B7B9"
            d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z"
            clip-rule="evenodd"></path>
        </svg>
        </div>`;

    const filledFavIcon = `
        <div class="filledFavIcon">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none">
            <path fill="#193DB0" fill-rule="evenodd"
            d="M18.97 5.449C18.693 2.408 16.54.202 13.847.202c-1.794 0-3.437.965-4.362 2.513C8.57 1.147 6.993.2 5.228.2 2.534.201.382 2.407.106 5.448c-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z"
            clip-rule="evenodd"></path>
        </svg>
        </div>`;

    products.forEach((i) => {
      const isFav = favorites.includes(Number(i.id));
      const productItem = $(`
            <div class="productItem" aria-label="ürünler">
                <div class="favIcon ${
                  isFav ? "filled" : "unfilled"
                }" data-id="${i.id}" style="cursor:pointer;">
                    <div class="unfilledFavIcon" style="display: ${
                      isFav ? "none" : "block"
                    }"> ${unfilledFavIcon} </div>
                    <div class="filledFavIcon" style="display: ${
                      isFav ? "block" : "none"
                    }">${filledFavIcon}</div>
                </div>
            
                <a class="productLink" aria-label="ürün linki" href=${
                  i.url
                } target="_blank">
                     <img class="productImage" aria-label="ürün resmi" src="${
                       i.img
                     }" alt="${i.name}">
                </a>

                <div class="productInfo">    
                    <a class="productLink"  aria-label="ürün linki"  href=${
                      i.url
                    } target="_blank">
                    <p class="productTitle"  aria-label="ürün adı"  >${
                      i.name
                    }</p>
                    </a>

                    <p class="productPrice"  aria-label="ürünün fiyatı"  >${
                      i.price
                    } TL</p>

                    <button class="addCart"  aria-label="sepete ekle butonu" >SEPETE EKLE</button>
                </div>
            </div>
      `);

      html.find(".carouselProducts").append(productItem);
    });

    $(".product-detail").after(html);

    setEvents();
  };

  const buildCSS = () => {
    const css = `
        .infoModal {
              position: fixed;
              z-index: 999999;
              top: 0;
              left: 0;
              right:0;
              bottom:0;
              background-color: rgba(0, 0, 0, 0.3);
          }

          .infoModalContent {
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

          .infoModalContent p {
                width: 280px;
                height: 100%;
                flex-grow: 0;
                font-size: 16px;
                line-height: 1.5;
                text-align: center;
                color: #555;
            }

          .infoButton{
              all: unset;
              cursor: pointer;
              margin-left:8px
            }

            .infoClose {
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




      .carouselSection{
            display:flex;
            justify-content: center;
            background-color:#f4f5f7;
            font-family: 'Open Sans', sans-serif !important;
        }

        .carouselContainer{
          width:80%;
        }
     
        .carouselBody {
         position:relative;
        }

       
         .carouselHeader{
          display:flex;
          flex-direction:row;
          align-items: center;
          line-height:43px;
          padding:15px 0;   

        }

        .carouselTitle {
                font-size: 32px;
                color: #29323b;
                line-height: 43px;
                font-weight: lighter;
                margin:0; 
               font-family: 'Open Sans', sans-serif !important;
            }



            .carousel {
            background-color:white;
            display: flex;
            flex-direction: column;
            background-color:#f4f5f7;
            max-width:100%;
            padding:0 0 32px;
            }
            
            
            .previousButton {
               position: absolute;
               top: 50%;
              left: -35px;
              transform: translateY(-50%);
              cursor: pointer;
              background-color: transparent;
              border: none;
              }
           
              .nextButton {
                position: absolute;  
                top: 50%;
                right: -35px;
                transform: translateY(-50%) rotate(180deg);
                cursor: pointer;
                background-color: transparent;
                border: none;
            }
            


            .productImage {
                width: 100%;
            }


            .carouselProducts::-webkit-scrollbar {
                width: 0;
                height: 0;
            }

            .carouselProducts {
                display: flex;
                flex-direction: row;
                gap: 1rem;
                overflow-x: auto;
                scroll-behavior: smooth;
                background-color:#f4f5f7;
                margin:0;
                padding:0;            
                }

            .productLink {
            text-decoration: none !important;
            }

            .productItem {
                position: relative;
                min-width: 220px;
                background-color:#ffffff;
            }

            .favIcon {
                position: absolute;
                top: 6%;
                right: 10%;
                z-index: 200;
                cursor: pointer;
            }

              
            .productInfo{
            padding:0 10px
            }

            .productTitle {
            color: #302e2b !important;
                font-size: 14px;
                height:40px;
                margin:5px 0 10px;
                cursor:pointer;
            }

            .productPrice {
                color: #193db0;
                font-size: 18px;
                display:flex;
                height:50px;
                margin:8px 0;
                align-items: flex-end;
                line-height: 22px;
                font-weight:bold;
            }

             .addCart{
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
                   .addCart {
                      display: block !important;
                     }

                    .previousButton{
                     display: none !important;
                    }

                    .nextButton{
                     display: none !important;
                     }
                 
                   .carouselSection{
                   justify-content:flex-start;
                   padding:0 15px;
                      }
                   
                      .carouselTitle{
                        font-size:24px;
                     }

                     .infoButton{
                       height:20px;
                
                     }
                     
                  .carouselContainer{
                     width: 100%;
                  }

                  .productItem {
                min-width: 280px;
                   }

                 .productImage{
                    height: 372.75px;
                    width: 280px;
                   }
                   .carouselProducts{
                  gap: 24.38px;
                 }
                }

                 
              @media (max-width: 768px) {
                .carouselProducts{
                  gap: 21px;
                 }
               }

              @media (max-width: 576px) {
                .carouselProducts{
                  gap: 15px;
                }
              }

              @media (max-width: 408px) {
              .carouselHeader{
                  flex-direction: column;
                  align-items: flex-start;
                }
              }

            `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const setEvents = () => {
    const scrollContainer = $(".carouselProducts")[0];
    const scrollAmount = scrollContainer.clientWidth / 2;
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener("mouseleave", () => {
      isDown = false;
    });

    scrollContainer.addEventListener("mouseup", () => {
      isDown = false;
    });

    scrollContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = x - startX;
      scrollContainer.scrollLeft = scrollLeft - walk;
    });

    $(".previousButton").on("click", () => {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    $(".nextButton").on("click", () => {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    $(".infoButton").on("click", () => {
      $(".infoModal").show();
    });

    $(".infoClose").on("click", () => {
      $(".infoModal").hide();
    });

    $(".productItem").on("click", ".favIcon", function () {
      const id = Number($(this).data("id"));
      const isFav = favorites.includes(id);

      if (isFav) {
        removeFromFavorites(id);
        favorites = favorites.filter((favId) => favId !== id);

        $(this).removeClass("filled").addClass("unfilled");
        $(this).find(".filledFavIcon").hide();
        $(this).find(".unfilledFavIcon").show();
      } else {
        saveToFavorites(id);
        favorites.push(id);

        $(this).removeClass("unfilled").addClass("filled");
        $(this).find(".unfilledFavIcon").hide();
        $(this).find(".filledFavIcon").show();
      }
    });

    $(".addCart").on("click", (e) => {
      e.stopPropagation();
      console.log("ürün sepete eklendi");
      alert("Ürün sepetinize başarıyla eklendi.");
    });
  };

  //Business Logics ve Fonksiyonlar
  const fetchProducts = async () => {
    try {
      const localData = getFromLocal();

      if (localData && localData.length) {
        products = localData;
        buildHTML();
        console.log("localden veriler yüklendi: ", localData);
      } else {
        const res = await fetch(URL);
        const data = await res.json();

        saveToLocal(data);
        products = data;
        buildHTML();

        console.log("veriler apiden çekildi.", data);
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      console.log("işlem tamam");
    }
  };

  const saveToLocal = (data) => {
    const dataWithTime = {
      data: data,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCALPRODUCTS_KEY, JSON.stringify(dataWithTime));
  };

  const getFromLocal = () => {
    const localData = localStorage.getItem(LOCALPRODUCTS_KEY);
    if (!localData) return null;

    const parse = JSON.parse(localData);
    if (Date.now() - parse.timestamp < DURATION) {
      return parse.data;
    } else {
      localStorage.removeItem(LOCALPRODUCTS_KEY);
      return null;
    }
  };

  const saveToFavorites = (id) => {
    if (!favorites.includes(Number(id))) {
      favorites.push(Number(id));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  };

  const getFromFavorites = () => {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  };

  const removeFromFavorites = (id) => {
    favorites = favorites.filter((favId) => favId !== Number(id));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  };

  init();
})();
