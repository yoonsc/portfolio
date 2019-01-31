if (typeof console === "undefined" || console === null) {
    console = {
      log: function() {}
    };
  }

var APP = APP || {};

APP.register = function(ns_name){
    var parts = ns_name.split('.'),
    parent = APP;    
    for(var i = 0; i < parts.length; i += 1){
        if(typeof parent[parts[i]] === "undefined"){
               parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

//글자수제한 
Array.prototype.valueIndex=function(pval)
{
     var idx = -1;
     if(this==null || this==undefined || pval==null || pval==undefined){
     }else{
      for(var i=0;i<this.length;i++){
       if(this[i]==pval){
        idx = i;
        break;
       }
      }
     }
     return idx
};


APP.isAlphaTween = true;

var browser = navigator.userAgent;
if(browser.toLowerCase().indexOf("msie 8")>0 || browser.toLowerCase().indexOf("msie 7")>0 ){
    APP.isAlphaTween = false;
}

(function(ns, $,undefined){    

    ns.register('mobileLink');        
    ns.mobileLink = function(){
        var _init = function() {
             var $target = $('body').find('[data-phone]');     

             if(jQuery.browser.mobile === true){ 
                $target.each(function() {                             
                    }).click(function() {
                var call_app = $(this).attr('data-phone');                       
                document.location.href=call_app;
                //var call_app = window.open(_link, "_blank");                    
                //call_app.close();
                });                    
            }            
             
        };                
        return {
            init: _init
        }
    }();
	
   ns.register('gnb');        
    ns.gnb = function(){
        var element, depth2Bg, depth2ConArr, depth1TotalNum, viewDepth2 = false, depth1Arr, depth2Arr=[], depth2ConArr=[], reSetTimer;        
                 
        var _init = function(){
            var i, max;
			var pathName = location.pathname; // 현재 페이지 주소
            var activeOk = false;
            var depth3Idx, curUrl, remoteUrl, folderDir, resultUrl;

            element = $('.gnb_menu');
            depth2Bg = $('#globalnav');                
            depth1Arr = element.find('> li > a');                                   
            windowWidth = $(window).width();                        
            depth1TotalNum = depth1Arr.length;      
            depth2ConArr = $('.submenu'); 
            depth2Arr = depth2ConArr.find('>ul>li>a');
            var $tabMenu = $(".tab_menu.sw, .tab_menu_box");
            
            depth1Arr.each(function(index, item){
                $(item).attr('name', 'depth1_'+index);   
				/*var $a = $(item);
				var href;
                $a.attr('name', 'depth1_'+index);   
				href = $a.prop( 'pathname' );
				if( href == pathName ) {
					$a.addClass( 'current' );
				}*/
            });

            depth1Arr.on('mouseenter focusin mouseleave focusout', depth1Handler);          
            for(i = 0, max = depth2ConArr.length; i<max; i++){
                depth2Arr[i] =  $(depth2ConArr[i]).find('a');
                depth2Arr[i].on('mouseenter focusin mouseleave focusout', depth2Handler);
                depth2Arr[i].each(function(index, item){
                    var $this = $(this);
					/*var $a = $(item);
					var href;
                    $a.attr('name', 'depth2_'+i+'_'+index); 
					href = $a.prop( 'pathname' );
					if( href == pathName ) {
						$a.addClass( 'current' );
					}*/
                    
                    if($this.attr("href") == pathName || $this.attr("data-remote") == pathName){                       
                       $this.not("[data-active='no']").addClass("current");
                       activeOk = true;
                    }else{
                        if(!activeOk){
                           if($tabMenu.find("a.on").parent().index() != 0){
                                curUrl = $tabMenu.find("a.on").attr("href");
                                remoteUrl = $tabMenu.find("li:first-child a").attr("href");
                                folderDir = pathName.split(curUrl)[0];
                                resultUrl = folderDir + remoteUrl;
                                
                                if($this.attr("href") == resultUrl) {
                                    if($this.data("active") != "no"){
                                        $this.addClass("current");
                                        activeOk = true;
                                    }
                                }
                            }
                        }
                    }
               });
            } 

            depth2ConArr.on('mouseenter mouseleave', depth2Handler); 
            depth2Bg.on('mouseenter mouseleave', function(e) {
                switch ( e.type ) {
                    case 'mouseenter':                                           
                       stopTimer();
                        break;                  
                    case 'mouseleave':
                       startTimer();                                                  
                        break;
                    }               
            });           
        };
      
        var depth1Handler = function(e){
            var num = e.currentTarget.getAttribute('name').substr(7,1);		
			
            //if($("body").hasClass("widescreen")){
                switch ( e.type ) {
                    case 'mouseenter':                        
                    case 'focusin':
                        stopTimer();
                        depth1Over(num); 
                        break;
                    case 'focusout':
                    case 'mouseleave':
                        startTimer();                    
                        break;    
                }
            //}else if($("body").hasClass("smallscreen")){                
             // depth1Over(num);                             
            //}                    
        };
        var depth1Over = function(num){                
            for(var i = 0; i < depth1TotalNum; i++){
                if(num == i){
                    $(depth1Arr[num]).addClass('on');
                    //$(depth2ConArr[num]).css({'opacity':1});
                   
                }else{
                    $(depth1Arr[i]).removeClass('on');
                    //$(depth2ConArr[i]).css({'opacity':.8});
                }
            }
            
            if(!viewDepth2){
                TweenLite.to($("#wrapper"), 0.3, {css:{className:'+=bkon'}});
                TweenLite.to(depth2Bg, 0.3, {css:{className:'+=on'}});
                TweenLite.to(depth2Bg, 0.5, {css:{height:530}, ease:Cubic.easeOut});                       
            }            
            viewDepth2 = true;
        };
        var depth2Handler = function(e){  
            var name = e.currentTarget.getAttribute('name');
            if(name != null){
                var num = name.substr(7,1);     
            }
            
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':  
                    TweenLite.to($(e.currentTarget), 0.2, {css:{className:'+=on'}});               
                    stopTimer();       
                    depth1Over(num);                                        
                    break;                    
                case 'focusout':
                case 'mouseleave':
                    TweenLite.to($(e.currentTarget), 0.2, {css:{className:'-=on'}}); 
                    startTimer();
                    break;
            }
        };          
        var startTimer = function(){
            clearTimeout( reSetTimer );
            reSetTimer = setTimeout (reSetMenu, 500 );
        };        
        var stopTimer = function(){
            clearTimeout( reSetTimer );
        };      
        var reSetMenu = function(){               
            depth1Over(null);            
            TweenLite.to($("#wrapper"), 0.3, {css:{className:'-=bkon'}});
            TweenLite.to(depth2Bg, 0.3, {css:{className:'-=on'}});
            TweenLite.to(depth2Bg, 0.5, {css:{height:0}, ease:Cubic.easeOut}); 
            viewDepth2 = false;
        }; 
         return {
            init: _init
        }
    }();
	
	
	ns.register('mobileGnb');        
    ns.mobileGnb = function(){
		var element, openBtn, closeBtn, hideX = -300, windowWidth, lnb_m, sItem, sItemLink, slnb_m, ssItem, ssItemLink, lastEvent = null, lastEvent2 = null;
		    	 
		var _init = function(){
	 		var i, max; 
                                
	 		element = $('.mobile_nav');	 		
	 		element.css('display', 'none')
	 		openBtn = $('header .openmenu').on('click', openGnb);
	 		closeBtn = $('.mobile_nav .closemenu').on('click', closeGnb);	

	 		windowWidth = $(window).width();
	 		$(window).resize(function(){
                    resize();   
            });
	 		$('.nav_layout').on('click', closeGnb);	 			
			
			//depth 1
            lnb_m = $('.mobile_gnb');
            sItem = lnb_m.find('>li');
            sItemLink = sItem.find('>a');
            sItem.find('>ul').css('display','none');
            lnb_m.find('>li>ul>li[class=active]').parents('li').attr('class','active');
            lnb_m.find('>li[class=active]').find('>ul').css('display','block');
            sItem.find('>a').click(lnb_mToggle).focus(lnb_mToggle);
			
			//depth 2
			slnb_m = lnb_m.find('.menu_svc');
            ssItem = slnb_m.find('>li');
            ssItemLink = ssItem.find('>a');
            ssItem.find('>ul').css('display','none');
            slnb_m.find('>li>ul>li[class=ison]').parents('li').attr('class','active');
            slnb_m.find('>li[class=ison]').find('>ul').css('display','block');
            ssItem.find('>a').click(lnb_subToggle).focus(lnb_subToggle);			
					
            var $all = sItemLink.eq(0);           
            if ($all.length > 0) {
                var url = (window.location.pathname).replace("http://", "");
                var uarr = url.split("/");
                var s = false;

                if (uarr.length > 1 && !s) {
                    if (uarr[1].length > 0) s = true;
                }               

                if (s) {
                    uarr[2] = decodeURIComponent(uarr[2]); //URL Depth 1  					
                    
                    cate = $('.mobile_gnb > li > a[data-url*="' + uarr[2] + '"]');
                    if (cate.length > 0) {
                        $(".mobile_gnb > li.active").removeClass("active");
                        cate.parent().addClass("active");
                        cate.next().show();
                    }						
                }
            }
            
 		};
        var openGnb = function(){
            var url = location.pathname;
            var activeOk = false;
            var curUrl, remoteUrl, folderDir, subRemote, subRemoteUrl, currentlink;

            lnb_m.find("a").each(function(i){
                var $this = $(this);

                if($this.attr("href") == url || $this.attr("data-remote") == url){
                    $this.not("[data-active='no']").addClass("active");
					$this.parents(".subfrd").show();
					lnb_m.find(".menu_svc > li").removeClass("ison");
					$this.parent().parent().parent().addClass("ison");
                    activeOk = true;
                }else{
                    if(!activeOk){
                        if($(".tab_menu.sw").find("a.on").parent().index() != 0){
                            curUrl = $(".tab_menu.sw").find("a.on").attr("href");							
                            remoteUrl = $(".tab_menu.sw li:first-child a").attr("href");
                            folderDir = url.split(curUrl)[0];
							currentlink = lnb_m.find("a[href='"+folderDir + remoteUrl+"']").not("[data-active='no']");
                            currentlink.addClass("active").parents(".subfrd").show();
							currentlink.parent().parent().parent().addClass("ison");
							
							
                        }
                        activeOk = true;
                    }
                }				
            });
			$('.menu_svc > li > a[data-url*="' + url + '"]').addClass("on");

        	element.css('display', 'block')
        	TweenLite.to(element, 0.5, {css:{right:0}, ease:Cubic.easeOut}); 

        	//TweenLite.to($('nav .close_con'), 0.5, {css:{right:$('nav .close_con').width(), rotation:-90}, ease:Cubic.easeOut, delay:0.3}); 
        	//TweenLite.to($('nav .home_con'), 0.5, {css:{top:0}, ease:Cubic.easeOut, delay:0.3}); 
        	
        	var wH = Math.max($(window).height(), $('.mobile_nav').outerHeight()+50);
        	$('#wrapper').css('height', wH);
        	$('.nav_layout').css('display', 'block');
            $('html, body').css('overflow', 'hidden');

        	
        }
        var closeGnb = function(){
        	TweenLite.to(element, 0.5, {css:{right:hideX}, ease:Cubic.easeIn, onComplete:function(){
        		element.css('display', 'none')
        	}}); 
        	//TweenLite.to($('nav .close_con'), 0.5, {css:{right:$('nav .close_con').width()*-1, rotation:0}, ease:Cubic.easeIn}); 
        	//TweenLite.to($('nav .home_con'), 0.5, {css:{top:$('nav .home_con').height() * -1}, ease:Cubic.easeIn});
        	$('#wrapper').css('height', '');
        	$('.nav_layout').css('display', 'none');
            $('html, body').css('overflow', '');
        }

        var resize = function(){
        	if(windowWidth == $(window).width()) return;
        	windowWidth = $(window).width();
        	closeGnb();
        }

        function lnb_mToggle(event){
            var t = $(this);            
            if (this == lastEvent) return false;
            lastEvent = this;
            setTimeout(function(){ lastEvent=null }, 200);
            
            if (t.next('ul').is(':hidden')) {
                sItem.find('>ul').slideUp(100);
                t.next('ul').slideDown(100);
            } else if(!t.next('ul').length) {
                sItem.find('>ul').slideUp(100);
            } else {
                t.next('ul').slideUp(100);
            }
            
            if (t.parent('li').hasClass('active')){
                t.parent('li').removeClass('active');                
            } else {
                sItem.removeClass('active');
                t.parent('li').addClass('active');
            }
        }
		
		function lnb_subToggle(event){
            var t = $(this);            
            if (this == lastEvent2) return false;
            lastEvent2 = this;
            setTimeout(function(){ lastEvent2=null }, 200);
            
            if (t.next('ul').is(':hidden')) {
                ssItem.find('>ul').slideUp(100);
                t.next('ul').slideDown(100);
            } else if(!t.next('ul').length) {
                ssItem.find('>ul').slideUp(100);
            } else {
                t.next('ul').slideUp(100);
            }
            
            if (t.parent('li').hasClass('ison')){
                t.parent('li').removeClass('ison');                
            } else {
                ssItem.removeClass('ison');
                t.parent('li').addClass('ison');
            }
        }

        return{
         	init:_init
         	
        };
    }();   

    ns.register('pageNavi');        
    ns.pageNavi = function(){
        var _init = function() {
            var url = (window.location.pathname).replace("http://", "");
            var uarr = url.split("/");
            var s = false;

            var $depth_end = $(".pageNavi").find("span:last"),
                $depth_first = $(".pageNavi").find(".depth_1"); 
                $depth_second = $(".pageNavi").find(".depth_2"); 
                $lastlink = $depth_end.find(">a");  

            if (uarr.length > 1 && !s) {
                if (uarr[1].length > 0) s = true;
            } 

            if (s) {
                uarr[2] = decodeURIComponent(uarr[2]);
                var current = $(".submenu").find(".current"),
                        currentTxt = current.text();
                
                if(uarr[2] == "service" ) { 
                    $(".depth_2").css("display", "inline-block");
                     var $targetdir = current.parent().parent().clone();
                     var $target = $(".mobile_gnb > li.active"),
                         $targetLink = $target.find(">a");
                     var $target2 = $(".menu_svc>li>ul>li>a.current").parent().parent().parent().find(">a");                         
                     depth1_url = $targetLink.attr('data-url');
                     depth1_txt = $targetLink.text();
                     depth2_url = $target2.attr('data-url');
                     depth2_txt = $target2.text();
                     $("<a />").appendTo($depth_first).text(depth1_txt).attr("href", depth1_url);
                     $("<a />").appendTo($depth_second).text(depth2_txt).attr("href", depth2_url);
                    $depth_end.addClass("this").append($targetdir);
                    $lastlink.text(currentTxt);

                    var cntlist = $targetdir.children().length;
                    if (cntlist == 1) {
                        $depth_end.removeClass("this");
                        $depth_end.find(">ul").remove();
                    }
                }else {
                    var $target = $(".mobile_gnb > li.active");
                    var $targetLink = $target.find(">a"),
                        $targetdir = $target.find(">ul").clone();                                 
                    depth1_url = $targetLink.attr('data-url');
                    depth1_txt = $targetLink.text();
                    $("<a />").appendTo($depth_first).text(depth1_txt).attr("href", depth1_url);                               
                    $depth_end.addClass("this").append($targetdir);
                    $lastlink.text(currentTxt);
                }               
                
            }
             

           if ($lastlink.length > 0) {             
                $lastlink.append('<i class="ico_arrow"></i>');
                $lastlink.click(function() {
                    if($(this).hasClass("open")){
                        $(this).removeClass("open");  
                        $(this).next().hide();        
                    }else{
                        $(this).addClass("open");       
                        $(this).next().show();
                    }                
                });
            }
        };

        return {
            init: _init
        }
    }(); 

	
	ns.register('navScroll');        
    ns.navScroll = function(){              
        var _init = function(ele) { 
            var $ele = $(ele);                                             
            var swiper = new Swiper($ele, {                
                spaceBetween: 0,
                slidesPerView: 'auto',
                freeMode: true,
                direction: 'horizontal',
                slideToClickedSlide: true,
                onInit:function(swiper){  
                    var totalWidth = 0;
                    var winWidth = $(window).width();
                    var $position = $ele.find('.navon').position();                           
                    var left = $position.left;
                    $ele.find('li').each(function(index, element) {
                        $(this).attr("data-nav-index",index);
                        totalWidth = totalWidth + $ele.find("[data-nav-index="+index+"]").outerWidth();                        
                    });
                    if(totalWidth > winWidth ){
                       var num = $(".navon").attr('data-nav-index'); 
                       swiper.slideTo(num);
                       /*if(num <= 2) {
                            $ele.transition({ x:0 }, 300, 'cubic-bezier(0.18, 0.35, 0.56, 1)');                            
                       } else if(num > 2 && num <= 4) {
                            $ele.transition({ x:-(left-60) }, 300, 'cubic-bezier(0.18, 0.35, 0.56, 1)');
                       } else {                            
                       }  */                                                                                       
                    }                  
                }
            }); 
        };      
        return {
            init: _init
        }
    }();
	
	

    ns.register('bannerhover');        
    ns.bannerhover = function(){
        var _init = function(ele) {  
           var $ele = $(ele).find('a');
           $ele.on('mouseenter focusin mouseleave focusout', function(e) {   
                if(jQuery.browser.mobile === false){ 
                    switch ( e.type ) {
                        case 'mouseenter':                        
                        case 'focusin': 
                            TweenLite.to($(this).find('img'), 0.5, {scale:1.1,ease:Cubic.easeOut});  
                            TweenLite.to($(this).find('.hoverbg'), 0.5, {css:{autoAlpha:.8},ease:Cubic.easeOut});
                            TweenLite.to($(this).find('.thumb-layer'), 0.1, {css:{autoAlpha:1},ease:Cubic.easeOut});                                                  
                            //TweenLite.to($(this).find('.at_title'), 0.1, {css:{autoAlpha:0},ease:Cubic.easeOut});
                            //TweenLite.to($(this).find('.at_cate'), 0.1, {css:{autoAlpha:0},ease:Cubic.easeOut});                            
                            break;
                        case 'focusout':
                        case 'mouseleave':
                            TweenLite.to($(this).find('img'), 0.5, {scale:1,ease:Cubic.easeOut});  
                            TweenLite.to($(this).find('.thumb-layer'), 0.1, {css:{autoAlpha:0},ease:Cubic.easeOut});
                            TweenLite.to($(this).find('.hoverbg'), 0.5, {css:{'opacity':0},ease:Cubic.easeOut});
                            //TweenLite.to($(this).find('.at_title'), 0.1, {css:{autoAlpha:1},ease:Cubic.easeOut});
                            //TweenLite.to($(this).find('.at_cate'), 0.1, {css:{autoAlpha:1},ease:Cubic.easeOut});                                                        
                            break;
                        }
                }
            });

        };
        return {
            init: _init
        }
    }();

   
    ns.register('mainvis');        
    ns.mainvis = function(){
        var _init = function(ele) {  
           var $ele = $(ele),
               $paging = $ele.parent().find(".dots"),
               $pause = $ele.parent().find(".control-pause"),
               $play = $ele.parent().find(".control-play"),
               $status = $(".loading");
            var mobj_1 = $("slide-img"),
                mobj_2 = $("v_subtit"),
                mobj_3 = $("v_tit"),
                mobj_4 = $("linebar");
               $ele.imagesLoaded({ background: '.slide-img' }).always( slickStart );
               resetProgress();

            function resetProgress() {
              $status.css({ opacity: 1, 'display':'block' });                            
            }

            function slickStart() {              
              $status.css({ opacity: 0, 'display':'none' });

                  $ele.slick({                                  
                    slidesToShow: 1,
                    slidesToScroll: 1, 
                    speed: 500,
                    fade:true, 
                    autoplay: true, 
                    autoplaySpeed: 7000, 
                    arrows: true, 
                    zIndex:100,
                    appendDots: $paging,
                    customPaging : function(slider, i) {              
                        return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + '</button>';
                    },
                    dots:true,
                    responsive: [
                    {
                      breakpoint: 1280,
                      settings: {
                        arrows: false
                      }
                    } 
                  ]
                });                          
            }                 

            $pause.click(function() {
                $(this).css('display','none');
                $play.css('display','inline-block');
                $ele.slick('slickPause');
            });

            $play.click(function() {
                $(this).css('display','none');
                $pause.css('display','inline-block');
                $ele.slick('slickPlay');
            });
            
            firstMotion($(".firstmt"));

            //TweenLite.to($('.slide-img'), 3.5, {css:{opacity:.5, scale:1.3}, ease:Cubic.easeOut});       
            $ele.on('afterChange', function(event, slick, currentSlide, nextSlide){                                    
                var index = $ele.find('.slick-slide');
                index.each(function(index, element) {                                        
                    if($(element).hasClass('slick-active') && !$(element).hasClass('slick-cloned')){                                                      
                      TweenLite.to($(this).find('.slide-img'), 3.8, {css:{autoAlpha:1, scale:1}, ease:Cubic.easeOut});                       
                      TweenLite.to($(this).find('.v_subtit'), .5, {y:0, autoAlpha: 1, ease:Cubic.easeOut, delay:1.2});  
                      TweenLite.to($(this).find('.v_tit'), .7, {y:0, autoAlpha: 1, ease:Cubic.easeOut, delay:1.4});
                      TweenLite.to($(this).find('.linebar'), 1, {width:'100%', ease:Cubic.easeOut, delay:1.7});                  
                    } else {                                                               
                      //TweenLite.to($(this).find('.slide-img'), .5, {css:{autoAlpha:.5, scale:1.3}, ease:Cubic.easeOut});
                      //TweenLite.set($(this).find('p'), {clearProps:"all"});
                      //TweenLite.set($(this).find('.linebar'), {clearProps:"all"});
                    }
                });
            });

            $ele.on("beforeChange", function(event, slick, currentSlide, nextSlide){
				/*if ( currentSlide !== nextSlide ) {
                    lazyBgImg( $(slick.$slides.get(nextSlide)) );
                }	*/			
                var num = currentSlide.currentSlide;
                TweenLite.to($(this).find('.slide-img'), 4, {css:{autoAlpha:.5, scale:1.3}, ease:Cubic.easeOut});
                TweenLite.to($(this).find('.v_subtit'), .5, {y:50, autoAlpha: 0, ease:Cubic.easeOut, delay:1.1}); 
                TweenLite.to($(this).find('.v_tit'), .7, {y:50, autoAlpha: 0, ease:Cubic.easeOut, delay:1.2}); 
                TweenLite.to($(this).find('.linebar'), 1, {width:'0', ease:Cubic.easeOut, delay:1.3});       
           });          


            function firstMotion(target){                
                TweenLite.to(target.find('.slide-img'), 3.5, {css:{opacity:1, scale:1}, ease:Cubic.easeOut}); 
                TweenLite.to(target.find('.v_subtit'), .5, {y:0, autoAlpha: 1, ease:Cubic.easeOut, delay:1.2});
                TweenLite.to(target.find('.v_tit'), .5, {y:0, autoAlpha: 1, ease:Cubic.easeOut, delay:1.4});                
                TweenLite.to(target.find('.linebar'), 1, {width:'100%', ease:Cubic.easeOut, delay:1.7});
            }


           function visualHeight(){
                var winH = $(window).height();
                var winW = $(window).width();
                var ratio = 0.6;
                var ori = 720;
                var $vis_Height = winW*ratio;
                var $vcell = $ele.find('.visual_cell');
			    var $con = $ele.parent();

                if(winW < 960){                    
                    $ele.height($vis_Height);
                    $vcell.height($vis_Height);
					$con.height($vis_Height);
                    $status.height($vis_Height);
                    //$.merge($ele, $vcell, $con, $status).height($vis_Height);					
                }else{                              
                    $ele.height(ori);   
                    $vcell.height(ori);   
					$con.height(ori);
                    $status.height(ori);
                }
            }
            visualHeight();
            $(window).resize(visualHeight);
        };
        return {
            init: _init
        }
    }();

    ns.register('articleSlide');        
    ns.articleSlide = function(){
        var _init = function(ele) {  
           var $ele = $(ele);          
           var $paging = $ele.parent().find(".dots");
           $ele.slick({                                  
                slidesToShow: 1,
                slidesToScroll: 1, 
                speed: 500,
                fade:false, 
                autoplay: false, 
                autoplaySpeed: 4000, 
                arrows: false, 
                appendDots: $paging,
                customPaging : function(slider, i) {										
                    return '<button>'+i+'</button>';
					
                },
                dots:true
            });                    
        };
        return {
            init: _init
        }
    }();

    ns.register('scrollimg');        
    ns.scrollimg = function(){	
        var _init = function() {  
			var $ele = $("body").find(".imgbg_sec");
			var ctrl = new ScrollMagic.Controller();
			var defaultH = $(".page_this").height();
			
			$ele.each(function(){    
				new ScrollMagic.Scene({
				triggerElement: this,
				triggerHook: "onEnter",
				duration: $ele.height()/*$ele.height()+ defaultH*/
				}).setTween((new TimelineMax).fromTo($ele.find(".bgbox"), 1, {
					yPercent: -25
				}, {
					yPercent: 0,
					ease: Power0.easeNone
				})).addTo(ctrl);				
		  });
			
        };
        return {
            init: _init
        }
    }();


    ns.register('mapResize');        
    ns.mapResize = function(){
        var _init = function(ele, ori) {
            var $ele = $(ele);        
                function mapsize(){
                    var winW = $(window).width();
                    var ratio = 0.6;
                    var $vis_Height = winW*ratio;

                    if(winW < 960){                    
                        $ele.height($vis_Height);         
                    }else{                              
                        $ele.height(ori);                       
                    } 
                }           
        
            $(window).resize(mapsize);
            mapsize();
        };

        return {
            init: _init
        }
    }();

    ns.register('ui.tabMenu');           
    ns.ui.tabMenu = function(ele, targetEle){
        var element, targetElement, tNum=0, tabContainer, tabBtn, tabBtnCon, contentsArr, totalTabNum;
        element = ele;
        targetElement = targetEle;
        tabBtn = element.find(">li:not(.deactive)");
        tabBtnCon = element.find(">li");
        totalTabNum = tabBtn.length;
        contentsArr= targetElement.find(">div");
        tabBtn.each(function(index, item){
            $(item).attr('name', 'tab_'+index);  
            
        });
        tabBtn.on('mouseenter focusin mouseleave focusout click', tabHandler);
        
        function tabHandler(e){
            var num = e.currentTarget.getAttribute('name').substr(4,1);
            if(tNum == num)return;
            
            switch ( e.type ) {
                case 'mouseenter':                        
                case 'focusin':
                   // tabOver(num); 
                    break;
                case 'focusout':
                case 'mouseleave':
                  //  tabOver(tNum);                   
                    break;   
               case 'click':
                    tabSelect(num);                                     
                    break;    
            }
        };
        
        function tabOver(num){  
            for(var i = 0; i<totalTabNum; i++){
                if(i== num){
                    TweenLite.to($(tabBtn[num]), 0, {className:'+=on'});    
                    TweenLite.to($(tabBtnCon[num]), 0, {className:'+=on'}); 
                }else{
                    TweenLite.to($(tabBtn[i]), 0, {className:'-=on'});  
                    TweenLite.to($(tabBtnCon[i]), 0, {className:'-=on'}); 
                }
            }       
            
        };
        
        function tabSelect(num){
            tabOver(num)
            tNum = num; 
            $(contentsArr[num]).siblings().removeClass('current');
            $(contentsArr[num]).addClass('current')
        }
        tabOver(tNum);
        tabSelect(tNum)
    }; 

    ns.register('hoverbox');        
    ns.hoverbox = function(){
        var _init = function(ele) {  
            var $ele = $(ele),
                $hoverList = $ele.find("a");
                $hoverList.on('mouseenter mouseleave focusin focusout', function(e) {
                switch ( e.type ) {
                    case 'mouseenter':                        
                    case 'focusin':                                                                                             
                         TweenMax.to($(this).find('.line_top'), .3, {css:{"autoAlpha":1, "width":"100%"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_left'), .3, {css:{"autoAlpha":1, "height":"100%"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_right'), .3, {css:{"autoAlpha":1, "height":"100%"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_bottom'), .3, {css:{"autoAlpha":1, "width":"100%"}, ease:"Power2.easeInOut"});
                        break;
                    case 'focusout':
                    case 'mouseleave':                        
                         TweenMax.to($(this).find('.line_top'), .3, {css:{"autoAlpha":0, "width":"0"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_left'), .3, {css:{"autoAlpha":0, "height":"0"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_right'), .3, {css:{"autoAlpha":0, "height":"0"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_bottom'), .3, {css:{"autoAlpha":0, "width":"0"}, ease:"Power2.easeInOut"});
                        break;    
                }
            });
        };
        return {
            init: _init
        }
    }();


    ns.register('faqAcMenu');           
    ns.faqAcMenu = function(ele){
        
        var element, btn, isOpen=false, listArr;
        var i, max;
        
        element=ele;
        listArr = $(element).find('>li>dl');
        
        btn = $(listArr).find('dt a');
        btn.on('click', openList);
        
        function listHandler(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':                             
                                                               
                    break;                    
                case 'focusout':
                case 'mouseleave':
                   
                    break;
            }
        }   
        
       function openList(e){         
            var parent = $(e.currentTarget).parent().parent()
            var viewCon = parent.find('>dd')
            if(parent.hasClass('on')){
                parent.removeClass('on');
                viewCon.css('display', 'none')
            }else{
                //listArr.removeClass('on');
                $(listArr).removeClass('on')
                $(listArr).find('>dd').css('display', 'none');
                parent.addClass('on');              
                viewCon.css('display', 'block');
                TweenLite.from(viewCon, 0.3, {css:{opacity:0}});  
            }   
       
        }
    };    
    
    
    ns.register('tablist');        
    ns.tablist = function(){
        var _init = function() {  
           $("div.tab_contents").css("display","none");
            if (!$('ul#tabList').length) { return; }
            $('#tab_content_wrap').each(function() {
                $(this).find('div.tab_contents:first').show();
            });
            $('ul#tabList li a').click(function() {
                if (!$(this).hasClass('on')) {
                    $(this).addClass('on').parent('li').siblings('li').find('a.on').removeClass('on');
                    $($(this).attr('href')).show().siblings('div.tab_contents').hide();
                }
               // this.blur();
              return false;
            });
        };
        return {
            init: _init
        }
    }();



    /* selecttype */
    ns.register('selectbox');        
    ns.selectbox = function(){              
        var _init = function(ele) { 
            var $ele = $(ele);
            var $btn = $ele.find('>a');
            var $list = $ele.find('>div');            
            $btn.click(function(e){
                e.preventDefault();
                if($(this).hasClass("open")){
                    $(this).removeClass("open");  
                    $list.hide();                         
                }else{
                    $(this).addClass("open");                    
                    $list.show();
                }
            });            
        };      
        return {
            init: _init
        }
    }();

    /* placeholder */
    ns.register('placeholder');        
    ns.placeholder = function(){              
        var _init = function() { 
          var $placeholder = $("body").find('.placeholder'),
            $inTxt = $placeholder.find('input');
            $inTxt.each(function () {
                if ($(this).val() != '') {
                    $(this).addClass('focus');
                };
            });

            $inTxt.on('focusin', function () {
                $(this).addClass('focus');
            });

            $inTxt.on('focusout', function () {
                if ($(this).val() === '') {
                    $(this).removeClass('focus');
                } else {
                    $(this).addClass('focus');
                }
            });
                        
            $placeholder.on('click', function () {
                $(this).find('input').focus();
            });      
        };      
        return {
            init: _init
        }
    }();
	
	ns.register('selectie');        
    ns.selectie = function(){              
        var _init = function() { 
			if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
                $("body").find(".select-wrapper").addClass("iestyle");
            }          
        };      
        return {
            init: _init
        }
    }();	

    /* datePicker */
    ns.register('datePicker');        
    ns.datePicker = function(){              
        var _init = function(inputId) { 
            $(inputId).datepicker({
                showOn: "both", // focus / button / both
                dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
                monthNames:[ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
                monthNamesShort: ["1월","2월","3월","4월","5월","6월", "7월","8월","9월","10월","11월","12월"],
                buttonText: "<i class='fa fa-calendar'></i>",
                dateFormat: "yy-mm-dd",
                changeMonth: true, 
                changeYear: true,
                yearRange: "1960:+nn",
				isRTL: false,
				yearSuffix: '',
				firstDay: 0
				
                //yearRange: '0+50'       
            });
        };      
        return {
            init: _init
        }
    }();

    // fileStyle function
    ns.register('fileStyle');        
    ns.fileStyle = function(){              
        var _init = function() { 
            var fileTarget = $('.filebox .upload-hidden');
                fileTarget.on('change', function () { // 값이 변경되면 
                    if (window.FileReader) { // modern browser 
                        var filename = $(this)[0].files[0].name;
                    } else { // old IE var 
                        filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출 
                    }
                    // 추출한 파일명 삽입 
                    $(this).siblings('.upload-name').val(filename);
                });
        };      
        return {
            init: _init
        }
    }();

    // 글자수제한
    ns.register('charLimit');        
    ns.charLimit = function(){ 
        var _init = function(ele, charNum) { 
            var $ele = $(ele);
			_calTxt(ele, charNum); //최초로딩시 추가
            // 키이벤트
            $ele.on("keyup", function(e){
                _calTxt(ele, charNum);
            });

            // 마우스 우클릭 복붙
            $ele[0].onpaste = function(){
                setTimeout(function(){
                    _calTxt(ele, charNum);
                }, 100);
            }
        };   

        var _calTxt = function(ele, charNum){
            var $ele = $(ele);
            var $remainTxt = $ele.parent().find('.remain_txt');
            var val = $ele.val();
            var limitCnt = charNum;
            var length = val.length;
            var newVal;

            if(length > limitCnt){
                alert(limitCnt + "자이상 입력하실 수 없습니다.");
                newVal = val.substr(0, limitCnt);
                $ele.val(newVal);
                $remainTxt.html(limitCnt);
            }else{
                $remainTxt.html(length);
            }
        };

        return {
            init: _init
        }
    }();


    ns.register('selectUpBox');           
    ns.selectUpBox = function(ele){
        
        var element, btn, isOpen=false, listCon, listHeight, closeTimer, listWrap;
        var i, max;
        
        element=ele;
        listWrap = $(element).find('div');
        listCon = listWrap.find('ul');
        btn = $(element).find('>a');
        $(element).find('>a').on('mouseenter focusin mouseleave focusout', listHandler);
        $(element).find('>a').on('click', openList);
        listHeight = $(listCon).outerHeight(true)
        listWrap.css('height', 0)
        listCon.find('li>a').on('mouseenter focusin mouseleave focusout', listHandler);     
        listCon.css('display', 'none');
        listCon.css('top', listHeight);
        function listHandler(e) {
            switch ( e.type ) {
                //case 'mouseenter':
                case 'focusin':                             
                    stopTimer();                                               
                    break;                    
                case 'focusout':
                //case 'mouseleave':
                    startTimer();
                    break;
            }
        }   
        function startTimer(){
            clearTimeout( closeTimer );         
            closeTimer = setTimeout (close, 700 );
        };        
        function stopTimer(){
            clearTimeout( closeTimer );
        };      
        function close(){    
            isOpen=true;           
            openList()
        };
         
        function openList(){
            listHeight = $(listCon).outerHeight(true);
            if(isOpen){
                isOpen = false;
                listWrap.css('height', 0);
                listCon.css('display', 'none');
                $(btn).removeClass('on');
                TweenLite.to(listCon, 0, {css:{top:listHeight}});   
            }else{
                isOpen = true;
                listWrap.css('height', listHeight);
                listCon.css('display', 'block');
                $(btn).addClass('on');
                TweenLite.to(listCon, 0.3, {css:{top:0}});   
            }
        }
    };

    // 백스페이스 막기
    ns.register('backspace');           
    ns.backspace = (function(){
        var init = function(){
            var backKeyCode = 8;
            var target;

            document.onkeydown = function(e){
                target = document.activeElement;
                
                if(e.keyCode == backKeyCode) {
                    var nowTag = target.tagName;

                    if(nowTag != "INPUT" && nowTag != "TEXTAREA") {
                        return false;
                    }
                    if(target.getAttribute("readonly") == true || target.getAttribute("readonly") == "") {
                        return false;
                    }
                }
            };
        };

        return {
            init:init
        }
    })();
	
	ns.register('popBanner'); 
    ns.popBanner = (function() {    	
        var imgHeight, popzone, resize, scroll, isOpen = true;            			
		var _init = function() {            							
			imgHeight = $('.pop_inner').find('img').height();
			popzone =  $('#popupzone');
			
			$('.closelayer').on('click', function(){                                                                
                if(isOpen){                                    	
                	TweenLite.to(popzone, 0.5, {height:0, ease:Cubic.easeIn});                 						
                	isOpen = false;
                }else{                                   	
					TweenLite.to(popzone, 0.5, {height:imgHeight, ease:Cubic.easeOut});					                	
                	isOpen = true;
                }                
            });
             $(window).resize(function(){
                  resize();
                  setTimeout(resize, 1000); 
             });  
			 resize();
			
			/*$(window).scroll(function(e) {
		        scroll();				
				setTimeout(scroll, 1000); 
		    });
			scroll()*/;
		};
        var resize = function(){
        	if(isOpen){   
				popzone.css('height', $('.pop_inner').find('img').height());
        	}
        }
		
		var scroll = function(e){						
 			var sTop = $(window).scrollTop(); 		
 			if(sTop > 0){
 				if(!isOpen)return;
 				TweenLite.to(popzone, 0.5, {height:0, ease:Cubic.easeIn}); 				
 				isOpen = false;
 			}else{
 				if(isOpen)return;
 				TweenLite.to(popzone, 0.5, {height:imgHeight, ease:Cubic.easeOut});
 				isOpen = true;
 			}
 			
 		}		
		
		return {
			init: _init
		}
	})();	
        
}(APP || {}, jQuery));

function GoTop() {
    TweenMax.to($('body, html'), 0.5, {scrollTop:0, ease:"Cubic.easeOut"});    
}


var LayerPopups = {
    find: function (id) {
        if (typeof (id) === 'string')
            return $((id.match(/^#/)) ? id : '#' + id);
        else
            return $(id).parents('.layerPopup');
    },
    open: function (id, closeOthers) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;

        GoTop(); //맨위로
        this.showScreen();        
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id)
                    $(this).show();
                else
                    $(this).hide();
            });
        }
        else {
            $id.show();
        }
    },
    close: function (id) {
        this.find(id).hide();
        this.hideScreen();
    },
    openAlert: function (id, closeOthers, target, txt) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;

        //GoTop(); //맨위로
        this.showScreen();     
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id){
                    $(this).attr("data-target", target);
                    $(this).find(".layer_txt").html(txt);
                    $(this).show();
                }else{
                    $(this).hide();
                }    
            });
        }
        else {
            $id.show();
        }
    },
    closeAlert: function (id) {
        var $id = this.find(id);

        $id.hide();
        this.hideScreen();
        if($id.attr("data-target") != "") {
            $($id.attr("data-target")).focus();
        }
        return;
    },
    closeAll: function () {
        $('.layerPopup').hide();
        this.hideScreen();
    },
    opened: function () {
        var opened = false;
        $('.layerPopup').each(function () {
            if ($(this).css('display') != 'none')
                opened = true;
        });
        return opened;
    },
    showScreen: function () {
        $('#layerScreen').fadeIn();
    },
    hideScreen: function () {
        if (!this.opened())
            $('#layerScreen').fadeOut();
    }
};