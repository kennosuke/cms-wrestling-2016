
$(function(){
	$(window).load(function(){
		var setWrap = $('.flickSlider'),
		setMainView = $('.flickView'),
		setThumbNail = $('.flickThumb'),
		setMaxWidth = 1000,
		setMinWidth = 320,
		thumbNum = 6,
		thumbOpc = 0.5,
		opac = 1,
		scrollSpeed  = 800,
		delayTime = 5000,
		easing = 'linear',
		sideNavi = 'on', // 'on' or 'off'
		autoPlay = 'off'; // 'on' or 'off'

		var agent = navigator.userAgent;
		setWrap.each(function(){
			var thisObj = $(this),
			childMain = thisObj.find(setMainView),mainUl = childMain.find('ul'),mainLi = mainUl.find('li'),mainLiLink = mainLi.children('a'),mainLiImg = mainLi.find('img'),
			childThumb = thisObj.find(setThumbNail),thumbUl = childThumb.find('ul'),thumbLi = childThumb.find('li'),thumbLiFst = childThumb.find('li:first'),thumbLiLst = childThumb.find('li:last'),
			mainWidth = parseInt(childMain.css('width')),mainHeight = parseInt(childMain.css('height')),listCount = mainUl.children('li').length;

			thisObj.css({display:'block'});

			// レスポンシブ動作メイン
			imgSize();
			function imgSize(){
				var windowWidth = parseInt($(window).width()),
				setUlLeft = parseInt(mainUl.css('left')),
				setlistWidth = parseInt(mainLi.css('width')),
				setLeft = setUlLeft / setlistWidth;

				if(windowWidth >= setMaxWidth) {
					thisObj.css({width:setMaxWidth});
					childMain.css({width:setMaxWidth});
					mainUl.css({width:((setMaxWidth)*(listCount))});
					mainLi.css({width:setMaxWidth});

					var listWidthA = parseInt(mainLi.css('width')),
					leftMax = -((listWidthA)*((listCount)-1)),
					baseHeight = mainLiImg.height();
					childMain.css({height:baseHeight});
					mainUl.css({height:baseHeight});
					mainLi.css({height:baseHeight});

					thumbUl.css({width:setMaxWidth});
					thumbLi.css({width:((setMaxWidth)/(thumbNum)),height:''});
				} else if(windowWidth < setMaxWidth) {
					var listWidthB = parseInt(childMain.css('width')),
					leftMax = -((listWidthB)*((listCount)-1));
					thisObj.css({width:setMaxWidth});
					if(windowWidth >= setMinWidth) {
						thisObj.css({width:'100%'});
						childMain.css({width:'100%'});
						mainUl.css({width:((listWidthB)*(listCount))});
						mainLi.css({width:(listWidthB)});
					} else if(windowWidth < setMinWidth) {
						thisObj.css({width:setMinWidth});
						childMain.css({width:setMinWidth});
						mainUl.css({width:((setMinWidth)*(listCount))});
						mainLi.css({width:setMinWidth});
					}
					var reHeight = mainLiImg.height();
					childMain.css({height:reHeight});
					mainUl.css({height:reHeight});
					mainLi.css({height:reHeight});

					var reWidth = setThumbNail.width();
					thumbUl.css({width:reWidth});
					thumbLi.css({width:((reWidth)/(thumbNum))});
				}

				var adjLeftWidth = parseInt(mainLi.css('width')),
				adjLeft = adjLeftWidth * setLeft;
				mainUl.css({left:(adjLeft)});
			}
			imgSize();
			$(window).resize(function(){
				if(!(agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1)){
					if(autoPlay == 'on'){clearInterval(setTimer);}
					imgSize();
					if(autoPlay == 'on'){slideTimer();}
				} else {
					imgSize();
				}
			});

			// フリックアクション
			var isTouch = ('ontouchstart' in window);
			mainUl.on(
				{'touchstart mousedown': function(e){
					if(mainUl.is(':animated')){
						e.preventDefault();
					} else {
						if(autoPlay == 'on'){clearInterval(setTimer);}
						if(!(agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1)){
							e.preventDefault();
						}
						this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
						this.leftBegin = parseInt($(this).css('left'));
						this.left = parseInt($(this).css('left'));
						this.touched = true;
					}
				},'touchmove mousemove': function(e){
					if(!this.touched){return;}
					e.preventDefault();
					this.left = this.left - (this.pageX - (isTouch ? event.changedTouches[0].pageX : e.pageX) );
					this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
					$(this).css({left:this.left});
				},'touchend mouseup mouseout': function(e){
					if (!this.touched) {return;}
					this.touched = false;

					var setThumbLiActive = thumbUl.children('li.active'),
					listWidth = parseInt(mainLi.css('width')),leftMax = -((listWidth)*((listCount)-1));

					if(((this.leftBegin)-30) > this.left && (!((this.leftBegin) === (leftMax)))){
						$(this).stop().animate({left:((this.leftBegin)-(listWidth))},scrollSpeed,easing);
						setThumbLiActive.each(function(){
							$(this).removeClass('active');
							$(this).next().addClass('active');
						});
					} else if(((this.leftBegin)+30) < this.left && (!((this.leftBegin) === 0))){
						$(this).stop().animate({left:((this.leftBegin)+(listWidth))},scrollSpeed,easing);
						setThumbLiActive.each(function(){
							$(this).removeClass('active');
							$(this).prev().addClass('active');
						});
					} else if(this.leftBegin === 0) {
						$(this).stop().animate({left:'0'},scrollSpeed,easing);
					} else if(this.leftBegin <= leftMax) {
						$(this).stop().animate({left:(leftMax)},scrollSpeed,easing);
					} else if(this.left >= 0) {
						$(this).stop().animate({left:'0'},scrollSpeed);
					} else if(this.left <= leftMax) {
						$(this).stop().animate({left:(leftMax)},scrollSpeed,easing);
					} else {
						$(this).stop().animate({left:(this.leftBegin)},scrollSpeed,easing);
					}
					compBeginLeft = this.leftBegin;
					compThisLeft = this.left;
					mainLiLink.click(function(e){
						if(!(compBeginLeft === compThisLeft)){
							e.preventDefault();
						}
					});
					if(autoPlay == 'on'){slideTimer();}
				}
			});

			// ボタン移動動作
			thumbLi.click(function(){
				if(autoPlay == 'on'){clearInterval(setTimer);}
				var listWidth = parseInt(mainLi.css('width')),leftMax = -((listWidth)*((listCount)-1)),
				connectCont = thumbLi.index(this);
				mainUl.stop().animate({left:(-(listWidth)*(connectCont))},scrollSpeed,easing);
				thumbLi.removeClass('active');
				$(this).addClass('active');
				if(autoPlay == 'on'){slideTimer();}
			});
			thumbLiFst.addClass('active');
			thumbLi.css({opacity:thumbOpc});

			// サイドナビボタン（有り無し）
			if(sideNavi == 'on'){
				$("#slider-box").append('<div class="btnPrev"><img src="images/slide-prev.svg" alt=""></div><div class="btnNext"><img src="images/slide-next.svg" alt=""></div>');
				var setPrev = $("#slider-box").find('.btnPrev'),setNext = $("#slider-box").find('.btnNext'),setPrevNext = $("#slider-box").find('.btnPrev,.btnNext');
				setPrevNext.css({opacity:opac});

				setNext.click(function(){
					var setThumbLiActive = thumbUl.children('li.active');
					setThumbLiActive.each(function(){
						var listLengh = thumbLi.length;
						var listIndex = thumbLi.index(this);
						var listCount = listIndex+1;
						if(listLengh == listCount){
							thumbLiFst.click();
						} else {
							$(this).next('li').click();
						}
					});
				});
				setPrev.click(function(){
					var setThumbLiActive = thumbUl.children('li.active');
					setThumbLiActive.each(function(){
						var listLengh = thumbLi.length;
						var listIndex = thumbLi.index(this);
						var listCount = listIndex+1;
						if(1 == listCount){
							thumbLiLst.click();
						} else {
							$(this).prev('li').click();
						}
					});
				});
			}

			// サムネイルマウスオーバー
			if(!(agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1 || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1)){
				thumbLi.hover(function(){
					$(this).stop().animate({opacity:'1'},300);
				},function(){
					$(this).stop().animate({opacity:thumbOpc},300);
				});
				if(sideNavi == 'on'){
					setPrevNext.hover(function(){
						$(this).stop().animate({opacity:'1'},300);
					},function(){
						$(this).stop().animate({opacity:opac},300);
					});
				}
			}

			// 自動再生（有り無し）
			if(autoPlay == 'on'){
				function slideTimer() {
					setTimer = setInterval(function(){
						var setThumbLiActive = thumbUl.children('li.active');
						setThumbLiActive.each(function(){
							var listLengh = thumbLi.length;
							var listIndex = thumbLi.index(this);
							var listCount = listIndex+1;
							if(listLengh == listCount){
								thumbLiFst.click();
							} else {
								$(this).next('li').click();
							}
						});
					},delayTime);
				}
				slideTimer();
			}
		});
	});
});
