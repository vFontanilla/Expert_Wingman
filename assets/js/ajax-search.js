jQuery(document).ready(function ($) {
    //initialization
    var apiUrl = 'https://api.madecomfy.com.au/api/v4/properties';
    var apiParams = {
        'page[size]': 20,
        'page[number]': 1, // Default page is 1
        'filters[adults]': 2,
        // 'filters[nwlng]': 141.80570312500004,
        // 'filters[nwlat]': -19.103175331900317,
        // 'filters[selat]': -46.46778828042279,
        // 'filters[selng]': 160.61429687500004

        'filters[nwlng]': 0,
        'filters[nwlat]': 0,
        'filters[selat]': 0,
        'filters[selng]': 0
    };

    console.log("API Parameters Sent:", apiParams);

    // Function to load properties based on current page
    function loadProperties(pageNumber, viewType) {
        $('#loading-spinner').show();

        apiParams['page[number]'] = pageNumber;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            data: apiParams,
            success: function (response) {
                console.log("Raw API Response:", response);

                var totalcount = response.count || 0;
                var totalPages = Math.ceil(totalcount / apiParams['page[size]']); // Calculate total pages
                console.log("Total Count:", totalcount);

                $('#property-count').text(`${totalcount} properties`);

                if (response.properties && Array.isArray(response.properties) && response.properties.length > 0) {
                    var resultsHtml = '';
                    var resultsHtml2 = '';
                    // var markers = [];
                    $.each(response.properties, function (index, property) {
                        var url = "No channels available";

                        // Checking if the channel array has 3 or 4 elements
                        if (property.channels && Array.isArray(property.channels)) {
                            // If there are 4 channels, use the 4th one
                            if (property.channels.length === 4 && property.channels[3].externalUrl) {
                                url = property.channels[3].externalUrl;
                            } 
                            // If there are only 3 channels, use the 3rd one
                            else if (property.channels.length === 3 && property.channels[2].externalUrl) {
                                url = property.channels[2].externalUrl;
                            }
                        }
                        console.log("URL slug:", url);

                        var price = (property.minimumNightlyRate / 100) || 'N/A';
                        var lat = property.latitude;     
                        var lng = property.longitude;  
                        
                        if(viewType === 'grid') {
                            console.log('Clicked Grid');
                            // Build the HTML for each property
                            resultsHtml += renderGridCard(property, url);

                            $('.property-cards-container').html(resultsHtml).removeClass('hidden').addClass('visible');
                        } else if (viewType === 'map') {
                            console.log('Clicked Map');
                            // Build the HTML for each property
                            resultsHtml2 += renderMapCard(property, url);

                            const priceTag = document.createElement("div");
                                priceTag.className = "price-tag";
                                priceTag.textContent = `A$${price}`;

                            const marker = new AdvancedMarkerElement({
                                map,
                                position: { lat: lat, lng: lng },
                                content: priceTag, 
                              });

                            markers.push({ marker: marker, propertyId: property.id, price: price });

                            $('.property-cards-container2').html(resultsHtml2).removeClass('hidden').addClass('visible');
                        }
                    });

                    setTimeout(() => {
                        initializeLazyLoading();
                    }, 500);

                     // 🔹 ADDING HOVER EFFECT (AFTER PROPERTIES LOAD)
                    setTimeout(() => {
                        document.querySelectorAll(".property-tag").forEach(link => {
                            const propertyId = link.getAttribute("data-property-id");
                            const markerObj = markers.find(m => m.propertyId === propertyId); // Match by property ID

                            console.log("Property ID:", propertyId);

                            if (markerObj) {
                                link.addEventListener("mouseenter", () => {
                                    console.log(`Hovering over property ${propertyId}`);
                                    markerObj.marker.content.style.backgroundColor = "#FF5733"; // 🔥 Change color
                                    markerObj.marker.content.style.color = "#FFFFFF";
                                    markerObj.marker.zIndex = 999; // 🔥 Bring to front
                                });

                                link.addEventListener("mouseleave", () => {
                                    markerObj.marker.content.style.backgroundColor = ""; // 🔄 Reset color
                                    markerObj.marker.content.style.color = "";
                                    markerObj.marker.zIndex = 1; // 🔄 Reset zIndex
                                });
                            } else {
                                console.warn(`Marker not found for property ID: ${propertyId}`);
                            }
                        });
                    }, 1000);

                    // Update pagination
                    updatePagination(pageNumber, totalPages);
                } else {
                    console.log("Properties array is missing or empty in the response.");
                    $('.property-cards-container').html('<p>No properties found or there was an error fetching data. Please try again later.</p>');
                }
            },
            error: function (xhr, status, error) {
                console.error('API Error:', error);
                $('.property-cards-container').html('<p>There was an error fetching the properties.</p>');
            },
            complete: function () {
                // Hide spinner after the request completes
                $('#loading-spinner').hide();
            }
        });
    }

    function renderGridCard(property, url) {
        const { name, propertyType, segment, location, minimumNightlyRate, guests, bedrooms, bathrooms} = property;
        const Amenity1 = (property.amenities && property.amenities.length > 0) ? property.amenities[0].name : 'No amenity available';
        const Amenity2 = (property.amenities && property.amenities.length > 1) ? property.amenities[1].name : 'No amenity available';
        const Amenity3 = (property.amenities && property.amenities.length > 2) ? property.amenities[2].name : 'No amenity available';
        const imageUrl = (property.photos && property.photos.length > 0) ? property.photos[0].url : 'default_image_path.jpg';

        return `
            <div class="property-card">
                <div class="card">
                    <picture>
                        <source data-srcset="${imageUrl}" type="image/webp">
                        <img class="card-img-top lazyload" data-src="${imageUrl}" src="low-quality-placeholder.jpg" alt="${name}">
                    </picture>
                    <div class="card-body">
                        <div>
                            <h5 class="card-title">
                                ${propertyType}
                                <span class="segment-badge">${segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                            </h5>
                        </div>
                        <div class="card-text">
                            <h4>${name}</h4>
                        </div>
                        <div>
                            <p class="location-pin-text">${location}</p>
                        </div>
                        <div class="price-info">From A$${(minimumNightlyRate / 100)} <span>/night</span></div>
                        <div class="card-footer">
                            <ul class="details">
                                <li>${guests} Guests</li>
                                <li>${bedrooms} Bedrooms</li>
                                <li>${bathrooms} Bathroom</li>
                            </ul>
                            <ul class="amenities">
                                <li>${Amenity1}</li>
                                <li>${Amenity2}</li>
                                <li>${Amenity3}</li>
                            </ul>
                        </div>
                        <a class="property-tag" href="${url}" target="_blank">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    function renderMapCard(property, url) {
        const { name, propertyType, segment, location, minimumNightlyRate, guests, bedrooms, bathrooms } = property;
        const Amenity1 = (property.amenities && property.amenities.length > 0) ? property.amenities[0].name : 'No amenity available';
        const Amenity2 = (property.amenities && property.amenities.length > 1) ? property.amenities[1].name : 'No amenity available';
        const Amenity3 = (property.amenities && property.amenities.length > 2) ? property.amenities[2].name : 'No amenity available';
        const imageCarousel = property.photos.map((photo, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img class="d-flex w-100" src="${photo.url}" alt="Property Image ${index + 1}">
            </div>
        `).join('');

        return `
            <div class="property-cardss">
                <div class="card d-flex flex-column flex-md-row flex-sm-column">
                    <div id="carousel-${property.id}" class="carousel slide property-carousel flex-shrink-0" data-bs-ride="carousel">
                        <div class="carousel-indicators">
                            ${property.photos.map((photo, index) => `
                                <button type="button" data-bs-target="#carousel-${property.id}" 
                                        data-bs-slide-to="${index}" 
                                        class="${index === 0 ? 'active' : ''}" 
                                        aria-current="${index === 0 ? 'true' : 'false'}" 
                                        aria-label="Slide ${index + 1}"></button>
                            `).join('')}
                        </div>
                        <div class="carousel-inner">${imageCarousel}</div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${property.id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${property.id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div class="card-body property-details flex-grow-1">
                        <div>
                            <h5 class="card-title">
                                ${propertyType}
                                <span class="segment-badge">${segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                            </h5>
                        </div>
                        <div class="card-text">
                            <h4>${name}</h4>
                        </div>
                        <div>
                            <p class="location-pin-text">${location}</p>
                        </div>
                        <div class="price-info">From A$${(minimumNightlyRate / 100)} <span>/night</span></div>
                        <div class="card-footer">
                            <ul class="details">
                                <li>${guests} Guests</li>
                                <li>${bedrooms} Bedrooms</li>
                                <li>${bathrooms} Bathroom</li>
                            </ul>
                            <ul class="amenities">
                                <li>${Amenity1}</li>
                                <li>${Amenity2}</li>
                                <li>${Amenity3}</li>
                            </ul>
                        </div>
                        <a class="property-tag" href="${url}" target="_blank" data-property-id="${property.id}">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to update the pagination dynamically
    function updatePagination(currentPage, totalPages) {
        var paginationHtml = '';
        var maxPagesToShow = 3; // Set how many pagination buttons to display at once
        // Previous Button
        paginationHtml += currentPage > 1 ? `<li class="page-item"><a class="page-link" href="#!" data-page="${currentPage - 1}" aria-label="Previous">Previous</a></li>` : `<li class="page-item disabled"><a class="page-link" href="#!" tabindex="-1" aria-label="Previous">Previous</a></li>`;
        // Dynamic Pagination Numbers
        var startPage = Math.max(1, currentPage - 1);
        var endPage = Math.min(totalPages, currentPage + 1);
        for (var i = startPage; i <= endPage; i++) {
            paginationHtml += currentPage === i
                ? `<li class="page-item active"><a class="page-link" href="#!">${i}</a></li>`
                : `<li class="page-item"><a class="page-link" href="#!" data-page="${i}">${i}</a></li>`;
        }
        // Next Button
        paginationHtml += currentPage < totalPages ? `<li class="page-item"><a class="page-link" href="#!" data-page="${currentPage + 1}" aria-label="Next">Next</a></li>` : `<li class="page-item disabled"><a class="page-link" href="#!" aria-label="Next">Next</a></li>`;

        $('.pagination').html(paginationHtml);
    }

    // Function to handle the active button effect
    function setActiveButton(button) {
        // Remove 'active' class from both buttons
        $('#grid-view-btn').removeClass('active');
        $('#map-view-btn').removeClass('active');
        // Add 'active' class to the clicked button
        $(button).addClass('active');
    }

    // Trigger loading properties when grid button is clicked
    $('#grid-view-btn').click(function() {
        var viewType = 'grid';
        setActiveButton(this);
        
        // Hide map view and show grid view with smooth transition
        $('.map-view-containerz').removeClass('visible').addClass('hidden');
        $('.property-cards-container').removeClass('hidden').addClass('visible');
        
        // Load properties for the grid view
        loadProperties(apiParams['page[number]'], viewType);
    });

    // Trigger loading properties when map button is clicked
    $('#map-view-btn').click(function() {
        var viewType = 'map';
        setActiveButton(this);
        
        // Hide grid view and show map view with smooth transition
        $('.property-cards-container').removeClass('visible').addClass('hidden');
        $('.map-view-containerz').removeClass('hidden').addClass('visible');
    
        if (!map) {
            initMap();
        }
        // Load properties for the map view
        loadProperties(apiParams['page[number]'], viewType);
    });

    // Open the modal when a button is clicked
    $('[data-toggle="modal"]').click(function() {
        $('#exampleModal').modal('show');
        console.log('Modal opened');
    });

    // Close the modal when the close button (X) or footer close button is clicked
    $('[data-dismiss="modal"]').click(function() {
        $('#exampleModal').modal('hide');
        console.log('Modal closed');
    });

    // Function for "Save changes" button
    $('#saveChangesBtn').click(function() {
        // Custom functionality for saving changes
        console.log('Save changes clicked');
        // You can perform any operation you need here, like sending data to the server or updating something on the page.
        // Optionally, close the modal after saving
        $('#exampleModal').modal('hide');
    });

    $(document).on('click', '.pagination .page-link', function (e) {
        e.preventDefault();
        var pageNumber = $(this).data('page');
        if (pageNumber) {
            var viewType = $('#grid-view-btn').hasClass('active') ? 'grid' : 'map';
            loadProperties(pageNumber, viewType);
        }
    });

    let map, AdvancedMarkerElement;
    var markers = [];
    window.initMap = async function () {
        // Create a map object and specify the DOM element for display
        const { Map } = await google.maps.importLibrary("maps");
        AdvancedMarkerElement = (await google.maps.importLibrary("marker")).AdvancedMarkerElement;

        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 }, // Default center
            zoom: 8,
            mapId: "4504f8b37365c3d0",
        });
    }

    function initializeLazyLoading() {
        let lazyImages = [].slice.call(document.querySelectorAll("img.lazyload"));
    
        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove("lazyload");
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            lazyImages.forEach(function (lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            lazyImages.forEach(function (lazyImage) {
                lazyImage.src = lazyImage.dataset.src;
            });
        }
    }

    // Initial Load
    var viewType = 'grid';
    $('#grid-view-btn').addClass('active');
    loadProperties(apiParams['page[number]'], viewType);
});