(function ($) {
    var menu ;

    var commonFun = {

        init: function () {
            this.initEvent();
            this.initMenu();
            this.getUserPhoto();
        },
        getUserPhoto: function () {
        },
        initEvent: function () {
            $('body').on('click', '[data-action]', function (e) {
                var func = $(this).attr('data-action');
                console.log(func);
                if (commonAction[func]) {
                    commonAction[func](this);
                }

            });
        },
        initMenu: function () {
            // var url = contextPath + '/oa/core/funcs/system/act/SystemAct/listMenu.act';
            // $.ajax({
            //     type: "GET",
            //     data: {},
            //     url: url,
            //     dataType: 'json',
            //     success: function (res) {
            //         if (res.rtState === '0') {
                        // console.log(res);
                        // menu = res.rtData.menu;
            //             for (var i = 0, len = menu.length, str = ''; i < len; i++) {
            //                 str += '<li>' +
            //                     '<a href="javascript:void(0)" data-id="' + menu[i].id + '" data-seqid="' + menu[i].seqId + '" data-action="loadSubmenu">' +
            //                     '<i class="fa fa-gittip"></i>' +
            //                     menu[i].text +
            //                     '<span class="fa fa-chevron-down"></span>' +
            //                     '</a>' +
            //                     '</li>'
            //             }

            //             $('.side-menu').html(str);

            //             setTimeout(function () {
            //                 var count = 0, total = $('.side-menu>li>a').length;
            //                 $('.side-menu>li>a').each(function (index, el) {


            //                     var parId;
            //                     parId = $(el).attr('data-id');

            //                     $.ajax({
            //                         url: '/oa/oa/core/funcs/system/act/SystemAct/lazyLoadMenu.act?parent=' + parId,
            //                         data: {},
            //                         type: 'get',
            //                         dataType: 'json',
            //                         success: function (res) {

            //                             var str = '', i = 0, len, submenu, str2 = '', n, len2;

            //                             if (res.rtState === '0') {

            //                                 submenu = res.rtData;
            //                                 len = submenu.length;

            //                                 str = '<ul class="nav child_menu">';
            //                                 for (; i < len; i++) {

            //                                     str += '<li><a href="javascript:void(0);">' + submenu[i].text
            //                                         + '<span class="fa fa-chevron-down"></span>'
            //                                         + '</a>';

            //                                     if (typeof submenu[i].children !== 'undefined' && submenu[i].children.length > 0) {
            //                                         str += '<ul class="nav child_menu">';

            //                                         for (n = 0, len2 = submenu[i].children.length; n < len2; n++) {

            //                                             str += '<li><a href="javascript:void(0);" data-action="openPage" data-href="' + submenu[i].children[n].url + '">' + submenu[i].children[n].text + '</a></li>';

            //                                         }

            //                                         str += '</ul>'
            //                                     }

            //                                     str += '</li>';

            //                                 }
            //                                 str += '</ul>';

            //                                 $(el).parent().append(str);

            //                                 count++;

            //                                 if (count === total) {
            //                                     setTimeout(function () {
            //                                         console.log('initFold');
                                                    commonFun.initFold();
            //                                     });
            //                                 }
            //                             }

            //                         }
            //                     })
            //                 });

            //             })
            //         }
            //     }
            // });
        },
        initFold: function () {
            var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
                $BODY = $('body'),
                $MENU_TOGGLE = $('#menu_toggle'),
                $SIDEBAR_MENU = $('#sidebar-menu'),
                $SIDEBAR_FOOTER = $('.sidebar-footer'),
                $LEFT_COL = $('.left_col'),
                $RIGHT_COL = $('.right_col'),
                $NAV_MENU = $('.nav_menu'),
                $FOOTER = $('footer');
            var debug = false;
            var commonsole = {
                log: function (msg) {
                    try {
                        if (debug) {
                            console.log(msg);
                        }
                    } catch (e) {
                        return 'Error:the function  log is not exist.';
                    }
                }
            };

            var debounce = function (func, threshold, execAsap) {
                var timeout;

                return function debounced() {
                    var obj = this, args = arguments;
                    function delayed() {
                        if (!execAsap)
                            func.apply(obj, args);
                        timeout = null;
                    }

                    if (timeout)
                        clearTimeout(timeout);
                    else if (execAsap)
                        func.apply(obj, args);

                    timeout = setTimeout(delayed, threshold || 100);
                };
            };
            // smartresize
            jQuery.fn['smartresize'] = function (fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger('smartresize'); };

            // Sidebar
            function init_sidebar() {
                // TODO: This is some kind of easy fix, maybe we can improve this
                var setContentHeight = function () {
                    // reset height
                    $RIGHT_COL.css('min-height', $(window).height());

                    var bodyHeight = $BODY.outerHeight(),
                        footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
                        leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                    // normalize content
                    contentHeight -= $NAV_MENU.height() + footerHeight;

                    $RIGHT_COL.css('min-height', contentHeight);
                };

                $SIDEBAR_MENU.find('a').on('click', function (ev) {
                    commonsole.log('clicked - sidebar_menu');
                    var $li = $(this).parent();

                    if ($li.is('.active')) {
                        $li.removeClass('active active-sm');
                        $('ul:first', $li).slideUp(function () {
                            setContentHeight();
                        });
                    } else {
                        // prevent closing menu if we are on child menu
                        if (!$li.parent().is('.child_menu')) {
                            $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                            $SIDEBAR_MENU.find('li ul').slideUp();
                        } else {
                            if ($BODY.is(".nav-sm")) {
                                $SIDEBAR_MENU.find("li").removeClass("active active-sm");
                                $SIDEBAR_MENU.find("li ul").slideUp();
                            }
                        }
                        $li.addClass('active');

                        $('ul:first', $li).slideDown(function () {
                            setContentHeight();
                        });
                    }
                });

                // toggle small or large menu
                $MENU_TOGGLE.on('click', function () {
                    commonsole.log('clicked - menu toggle');

                    if ($BODY.hasClass('nav-md')) {
                        $SIDEBAR_MENU.find('li.active ul').hide();
                        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                    } else {
                        $SIDEBAR_MENU.find('li.active-sm ul').show();
                        $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                    }

                    $BODY.toggleClass('nav-md nav-sm');

                    setContentHeight();
                });

                // check active menu
                $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

                $SIDEBAR_MENU.find('a').filter(function () {
                    return this.href == CURRENT_URL;
                }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
                    setContentHeight();
                }).parent().addClass('active');

                // recompute content when resizing
                $(window).smartresize(function () {
                    setContentHeight();
                });

                setContentHeight();

                // fixed sidebar
                if ($.fn.mCustomScrollbar) {
                    $('.menu_fixed').mCustomScrollbar({
                        autoHideScrollbar: true,
                        theme: 'minimal',
                        mouseWheel: { preventDefault: true }
                    });
                }
            }
            // /Sidebar

            init_sidebar();
        }
    };

    var commonAction = {
        openPage: function (el) {
            var url = $(el).attr('data-href');
            var title = $(el).text();
            var config = {
                page: [{
                    title: title,
                    url: url
                }]
            };
            console.log(config);

            this._getSpecifiedPage(config);
        },
        _getSpecifiedPage: function(config) {
            let defaults = {
                page: [
                    {
                        title: "新页面",
                        url: "",
                        mode: "col-md-12 col-sm-12 col-xs-12",
                        button: []
                    }
                ]
            }, page_button = "", pagemain = "";
    config = $.extend(defaults, config);
    let pag = config.page;
    if (pag.length > 0) {
        $('[role="main"]').html("");
        for (let i = 0; i < pag.length; i++) {
            if (pag[i].button != undefined) {
                if (pag[i].button.length > 0) {
                    for (let l = 0; l < pag[i].button.length; l++) {
                        page_button += `<li>
											<button type="button" class="${pag[i].button[l].style}"
												onclick="${pag[i].button[l].func}" title="${pag[i].button[l].title}">
												${pag[i].button[l].title}
											</button>
										</li>`;
                    }
                }
            }
            pagemain = `<div class="${pag[i].mode}">
								<div class="x_panel">
									<div class="x_title">
										<h2 id="page-title" page_name_${i}>${pag[i].title}</h2>
										<ul class="nav navbar-right panel_toolbox" page_button>
											${page_button}
										</ul>
										<div class="clearfix"></div>
									</div>
									<div class="x_content" id="page-main" page_body_${i}>

									</div>
								</div>
							</div>`;
            $('[role="main"]').append(pagemain);
            $(`#page-main[page_body_${i}]`).load(pag[i].url);
        }
        $('[role="main"]').append(`<div class="clearfix"></div>`);
    }
}
    };

    commonFun.init();


})(jQuery);
