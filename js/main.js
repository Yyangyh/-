/**
 *************************************************************
 * @Author: Administrator
 * is not a jock
 * @BY - zj
 * @start time: on 2018/9/11
 *************************************************************
 */
'use strict';
requirejs.config(requireConfig);
requirejs(['zepto','swiper','constant','ux'], function ($,swiper,constant,ux) {
	
			new Swiper('.swiper-container', {
				direction: 'horizontal',//滑动方向：水平方向
				speed: 1000,
				loop: true,
				autoplay: 3000,//可选选项，自动滑动
				
				//pagination: '.swiper-pagination',// 如果需要分页器
				paginationHide: true,  //默认分页器会一直显示。这个选项设置为true时点击Swiper会隐藏/显示分页器。
				// 如果需要前进后退按钮
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				// 如果需要滚动条
				//scrollbar: '.swiper-scrollbar',
				initialSlide: 1,//设置初始化slide的索引，也就是设置图片从第几张开始轮播
				grabCursor: true,
				hashnav: false,//为每个slide增加散列导航（有点像锚链接）  并在每个slide处增加data-hash属性。

			});
});



