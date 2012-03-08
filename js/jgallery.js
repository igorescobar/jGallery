/*!
 * jGallery jQuery Plugin
 *
 * http://blog.igorescobar.com/
 *
 * Copyright 2010, Igor Escobar
 *
 * Date: Mon Jul 5 22:43:34 2010
 */

$(function(){

  var jgOptions = {};

  /**
   * Creates all HTML structure to the jGallery work's sweet.
   * - Next, prev e close button.
   * - Slide buttons.
   */
  jQuery.fn.createjGallery = function ( ) {
      
    $( 'body' ).prepend (  
     '<div class="jgBackground"></div> \
      <div class="jgContainer"> \
        <div class="image"> \
          <div class="nav"> \
            <a href="#" class="prev"></a> \
            <a href="#" class="next"></a> \
            <a href="#" class="close"></a> \
          </div> \
          <div class="img"> \
            <img src="#" id="jgallery"/> \
            <div class="jgCarrocel"> \
              <div class="subNav"> \
                <a href="#" class="jgcarocel-prev"></a> \
                <a href="#" class="jgcarocel-next"></a> \
              </div> \
              <div class="jgFullGallery"></div> \
            </div> \
          </div> \
          <div class="legenda"></div> \
        </div> \
       </div>' );
      
  };

  /**
   * Setting jGallery Events
   * - Next, prev e close buttons.
   * - Caroucel buttons.
   * - Closes the gallery when some click occurs outside of the gallery area.
   */
  jQuery.fn.setjGalleryEvents = function ( ) {
    
    // keeps jGallery background always with the window size.
    $( window ).bind ( 'resize' , function () {
      
      $( this )._setContainerCSS ( );
      $( this ).centralizaImageContainer ( );
      
    });
    
    // closes the jGallery if i click on the background
    jgOptions.jgBackground.bind ( 'click' , function () {
      
      jgOptions.jgIsOpen = false;
      jgOptions.jgCurrentPage = 0;
      jgOptions.jgGallery.animate ( { right: '0' } , 1000 );
      
      $( 'div.jgContainer > *' ).fadeOut ( 'slow' , function () {
        $( 'div.jgBackground' ).fadeOut ( 'slow' );
      });
      
      return false;
    });
    
    // closes the jGalerry event
    $('.jgContainer .image div.nav a.close').bind ('click', function () {  
      
      $( '.jgBackground' ).trigger('click');
          
      return false;
    });
    
    // setting the next image event
    $('.jgContainer .image div.nav a.next').bind ('click', function () {
      
      if ( jgOptions.openedImage.next().length > 0 )
        $(this)._switchImage ( jgOptions.openedImage.next('a') );
      
      return false;
    });
    
    // setting previous image event
    $('.jgContainer .image div.nav a.prev').bind ('click', function () {
      
      if ( jgOptions.openedImage.prev().length > 0 )
        $(this)._switchImage ( jgOptions.openedImage.prev('a') );
      
      return false;
    });
    
    // SLIDES
    // Previous page of the caroucel event
    $('.jgContainer .image .subNav a.jgcarocel-prev').bind ('click' , function () {
      
      var container_width = parseInt ( jgOptions.jgCarrocelGallery.css ( 'width' ).replace ('px', '' ), 10 );
      var atual_container_right = parseInt ( jgOptions.jgGallery.css ( 'right' ).replace ( 'px', '' ), 10 );
      
      if ( jgOptions.jgGallery.css('right') != '0px' && $( jgOptions.jgGallery ).queue ( "fx" ).length == 0 ) {
        jgOptions.jgCurrentPage -= 1;
        
        if ( ( atual_container_right - container_width ) < 0 )
          container_width = atual_container_right;    
      
        jgOptions.jgGallery.animate ( { right: '-=' + container_width } , 1000 );
      }
      
      return false;
    });
    
    // Next caroucel page event
    $('.jgContainer .image .subNav a.jgcarocel-next').bind ('click' , function () {
      
      var container_width = parseInt ( jgOptions.jgCarrocelGallery.css ( 'width' ).replace ( 'px', '' ), 10 );
      
      jgOptions.jgMaxNextClick = Math.floor ( jgOptions.jgGalleryTotalWidth / ( container_width ) ) ;

      if ( jgOptions.jgCurrentPage < jgOptions.jgMaxNextClick ) { 
        jgOptions.jgCurrentPage += 1;
        jgOptions.jgGallery.animate ( { right: '+=' + container_width  } , 1000 );
      }
      
      return false;
    }); 
    
    jgOptions.jgCarrocelGallery.bind({
      mouseenter: function() {
        $( this ).fadeTo ('fast', 0.9);
      }
    });
    
    jgOptions.jgContainerImageObject.bind('mouseover', function () {
      jgOptions.jgCarrocelGallery.fadeTo ( 'slow' , 0.1 );
    });
    
    $(window).keydown ( function (event) {
      
      // [ mac, window, linux ]
      var key_left  = [37];
      var key_right = [39];
      
      var key_p   = [80];
      var key_n   = [78];
      var key_esc   = [27];
        
      if ( jgOptions.jgIsOpen == true && ( jQuery.inArray (event.keyCode, key_right) == 0 || jQuery.inArray (event.keyCode, key_n) == 0 ) )
        $('.jgContainer .image div.nav a.next').trigger('click');
        
      if ( jgOptions.jgIsOpen == true && ( jQuery.inArray (event.keyCode, key_left) == 0 || jQuery.inArray (event.keyCode, key_p) == 0 ) )
        $('.jgContainer .image div.nav a.prev').trigger('click');
      
      if ( jgOptions.jgIsOpen == true && ( jQuery.inArray (event.keyCode, key_esc) == 0  ) )
        $( '.jgBackground' ).trigger('click');
          
    });
  };

  jQuery.fn.extend({  
    
    // get the total width of the gallery
    _getJGalleryTotalWidth: function ( width , height ) {
      jgOptions.jgGalleryTotalWidth = 0;
      
      jgOptions.openedGallery.find('img').each ( function ( ) {
        jgOptions.jgGalleryTotalWidth += $( this ).width() + 2;
      });
    },
    
    // receive the proportional size of the image based on
    // width and height of the window
    _getProportionalSize: function ( width , height ) {
      
      var sizes = Array(width, height);

      if ( width > jgOptions.jgImageMaxWidth ) {
        sizes[0] = ( ( jgOptions.jgImageMaxWidth * width ) / width );
        sizes[1] = jgOptions.jgImageMaxWidth;     
      } 
      
      if ( height > jgOptions.jgImageMaxHeight ) {
        sizes[0] = ( (  jgOptions.jgImageMaxHeight * width ) / height );
        sizes[1] = jgOptions.jgImageMaxHeight;
      }

      return sizes;
    },
    
    // setting all CSS configurations.
    _setContainerCSS: function ( ) {
      
      // Setting the alpha background if the user want to.
      if ( typeof jgOptions.jgBackgroundOpacity == "number" )
        jgOptions.jgBackground.css ( { opacity: jgOptions.jgBackgroundOpacity } );

      jgOptions.jgGallery.css ( { 'width': jgOptions.jgGalleryTotalWidth } );
      jgOptions.jgCarrocelGallery.css ( { 'width': jgOptions.jgContainerImageObject.css('width') } );
      
      // background of the jGallery.
      jgOptions.jgBackground.css ({
        height: $(document).outerHeight (),
        width: $(document).outerWidth ()
      });
      
    },
    
    // set the source, width and height of the image 
    _setImage: function ( src, w, h ) {
      
      jgOptions.jgContainerImageObject.attr ( 'src', src );
      jgOptions.jgContainerImageObject.attr ( 'width', w );
      jgOptions.jgContainerImageObject.attr ( 'height', h );
      
    },
    
    // shows the loader when it's necessary
    _setLoader: function ( ) {
      
      jgOptions.jgContainerImage.append('<div class="jgloader"></div>');
        
    },
    
    // do the preloading of an image then call the callback method
    _preLoadImage: function(src, onLoadCallback){
      var preloadImage = new Image ( );
          preloadImage.src = src;
          $(preloadImage).load(function(){
            onLoadCallback(this);
          })
    },

    // replace the current image when the click happens
    // replace the current image when the prev and next button
    // was clicked
    _switchImage: function ( oLinkClick ) {
      
      jgOptions.openedImage = oLinkClick;
      
      // add the css class of the clicked image on the current clicked image
      jgOptions.openedImage.find('img').addClass('jgImageClicked');
      
      // image preloading
      var image_title = oLinkClick.find( 'img' ).attr('title');
      
      jgOptions.jgContainerImage.find('.jgloader').show();

      $(this)._preLoadImage(oLinkClick.attr('href'), function(preload){

        // if the navigation is hidden then show.
        if ( $( '.nav' ).css ( 'display' ) == 'none' ) 
          $( '.nav' ).fadeIn ( 'slow' );

        // get the propotional image size.
        var sizes = $(this)._getProportionalSize(preload.width, preload.height);
        
        // images can't be bigger than the maximum allowed.
        preload.width = sizes[0];
        preload.height = sizes[1];
        
        jgOptions.jgGalleryHeight = jgOptions.openedImage.find ('img').height ();
                
        // hide the image container
        jgOptions.jgContainerImage.fadeOut('fast', function () {
          
          // hides the loeader
          jgOptions.jgContainerImage.find('.jgloader').hide();
          
          // loads the clicked image
          $( this )._setImage ( oLinkClick.attr ( 'href' ) , preload.width, preload.height );   
          
          // subtitle attachmend
          if ( image_title != '' ) {
            $( '.jgContainer .image div.legenda' ).html ( image_title );
            $( '.jgContainer .image div.legenda' ).fadeIn ( 'slow');
          } else {
            if ( jgOptions.jgCarrocelGallery.css('bottom') == '30px' )
              jgOptions.jgCarrocelGallery.animate({bottom: '-=30px'});
          }
          
          // shows the big imagem
          jgOptions.jgContainerImage.fadeIn ( 'fast' );

          // Update the CSS propertys and the container
          $( this ).centralizaImageContainer ( );
          $( this )._setContainerCSS ( );
          
        });
      });
    },
    
    // keeps the image always on the center
    centralizaImageContainer: function ( ) {
      
      var calc_top = ( ( $( window ).height () / 2) - ( jgOptions.jgContainerImage.innerHeight() / 2 ) );
          calc_top = (calc_top < 0 ) ? 0 : calc_top;
        
      jgOptions.jgContainerImage.css ( {
        left: ( $( window ).width () - jgOptions.jgContainerImageObject.width() ) / 2,
        top: calc_top
      });
      
    },
    /*
     * Optional parameters
     * - jgImageMaxHeight (Integer)
     * - jgImageMaxWidth (Integer)
     * - jgBackgroundOpacity (Float)
     */
    jGallery: function ( parametros ) {
      
      $( this ).createjGallery();

      // max height that an image can have
      jgOptions.jgImageMaxHeight = $( window ).height () * 0.90;
      // max width that an image can have
      jgOptions.jgImageMaxWidth = $( window ).width () * 0.95;
      // setting default background opacity
      jgOptions.jgBackgroundOpacity = 0.5;
      // indicates when jGallery is opened
      jgOptions.jgIsOpen = false;
      // caroucel element inside of an opened jGallery
      jgOptions.jgCarrocelGallery = $( '.jgCarrocel' );
      // saved opened gallery images element
      jgOptions.jgGallery = $( '.jgFullGallery' );
      // store the height of the gallery pop-up
      jgOptions.jgGalleryHeight = 0;
      // receive the max width of the opened gallery by adding the width of all thumbnails
      jgOptions.jgGalleryTotalWidth = 0;
      // save's the number of pages of the caroucel
      jgOptions.jgMaxNextClick = 0;
      // current caroucel page
      jgOptions.jgCurrentPage = 0;
      // background element
      jgOptions.jgBackground = $( '.jgBackground' );
      // jGallery container
      jgOptions.jgContainer = $( '.jgContainer' );
      // navigation, big picture and thumbnails element
      jgOptions.jgContainerImage = $( '.jgContainer .image');
      // current opened picture element
      jgOptions.jgContainerImageObject = $( '.jgContainer .image img#jgallery');
      // opened gallery object
      jgOptions.openedGallery = null;
      // current opened image element
      jgOptions.openedImage = null;

      $.extend ( jgOptions, parametros );

      $( this ).setjGalleryEvents();
      $( this )._setLoader();

      // more then one gallery per page
      $( this ).each ( function ( ) {

        $( this )._setContainerCSS ( );
        
        // Open the respective gallery of the clicked image
        $( this ).find ( 'a:has(img)' ).bind ( 'click' , function ( ) { 
          
          jgOptions.openedGallery = $( this ).parent();

          jgOptions.jgIsOpen = true;
          
          jgOptions.jgGallery.html ('');
          
          // clones the gallery
          jgOptions.openedGallery.find ( 'a:has(img)' ).each ( function () {
            $( $(this) ).clone ( ).appendTo ( jgOptions.jgGallery );  
            $( this )._getJGalleryTotalWidth();
          });
          
          // link object
          jgOptions.openedImage = $( this );

          $(this)._preLoadImage(jgOptions.openedImage.attr('href'), function(imageObject){

            jgOptions.jgBackground.fadeIn ( 'slow' , function () {
              // shows the container
              jgOptions.jgContainer.fadeIn ( 2000 , function () {
                jgOptions.jgCarrocelGallery.slideDown ( 'slow' );
              });
              
              $( this )._switchImage ( jgOptions.openedImage );
            });
          });
          
          return false;
          
        });
        
        // switch the image if the click on the floating box happen.
        $( '.jgFullGallery' ).find ( 'a:has(img)' ).live ( 'click' , function ( ) {       
          
          jgOptions.openedImage = $( this );
          $( this )._switchImage ( jgOptions.openedImage );
            
          return false;
          
        });
      });
    } 
  });
});