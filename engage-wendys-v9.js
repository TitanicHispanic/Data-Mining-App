/*
 * All code (c)2015 Directions Research Inc.
 * All rights reserved. Copying or distribution of this code without
 * written authorization from its owner is strictly prohibited.
 *
 * Authors:
 * Angelo Dania
 *
 * Peter Ariosa
 * Brock Whitaker
 *
 */

// * STRUCTURE THESE
// * NO UNDERSCORES (BECAUSE OF UNDERSCORE.JS)
// * CHANGE TO OOP FORMAT
// * NAMES OK

var treePRODUCTS
,   treeMETRICS
,   treeFILTERS
,   treeDATES
,   vCurrentItems
,   vSelectedDate
,   vDataFilters
,   vDataProducts
,   vDataMetrics
,   vDataUserList
,   vDataScorecardLayout
,   vDataFiltersClean
,   vExpireInterval
,   vCheckActive
,   vCurrentDraggable
,   vCurrentE
,   _currentProdDrag
,   vCurrentThis
,   elPaste
,   paste_values
,   array_paste_values
,   thisPNG = ""
,   vEXIT = ["23 skidoo!", "Going once, going twice...", "Aloha", "Leave", "Exit", "Exeunt", "Sayonara", "Hasta Luego, Winnebago", "Bye", "See-ya", "I'm Outie", "Peace Out!", "Adios", "Ciao", "Hasta la vista", "Cheerio!", "Toodles", "Bon Voyage", "Fare thee well", "Auf Wiedersehen", "Au revoir", "In a while, crocodile", "Tallyhoo", "Elvis is leaving the building", "Cheers!", "Dasvedania", "I've had enough", "'86' me", "TTYL", "Hasta Lasagna!", "Leaving so soon?", "Was it something I said?"]
,   vDataListView = new kendo.data.DataSource({data: []})
,   vDataDeepDive = new kendo.data.DataSource({data: []})
,   vDataProductsFlat = new kendo.data.DataSource({data: []})
,   selYears = []
,   selQuarters = []
,   selMonths = []
,   vDefaultCols = [
        {field: "id", hidden: true}
    ,   {field: "item",       title: "&nbsp;", width: 330, headerAttributes: {class: "noborder-left"}, attributes: {class: "noborder-left"}}
    ,   {field: "base",       title: "base",   width: 94,  headerAttributes: {class: "noborder-left"}, attributes: {class: "noborder-left"}}
    ,   {field: "blankspace", title: "&nbsp;"}
    ]
, MINMAX
,   COLS_LIST
,   SCORECARD_KEY = null
,   JARTREND_SELECTION_START = -1
,   JARTREND_SELECTION_END = -1;

// -------------------------------------
// PIVOT/COLUMNS/ROWS
// -------------------------------------
var vPIVOT_DATA_SOURCE = []
,   vPIVOT_DROP_HEADER = ""
,   vPIVOT_DROP_INDEX  = 0
,   vCELL_A_IDS_IDX = 1
,   vCELL_A2_IDS_IDX = 0
,   vCELL_B_IDS_IDX = 1
,   CELL_A_CHILD_IDS_IDX = ""
,   CELL_C_IDS_IDX = 0
,   CELL_C_CHILD_IDS_IDX1 = 1
,   CELL_C_CHILD_IDS_IDX2 = 5
,   PIVOT_SELECTIONS = ""
,   PIVOT_IDS_SELECTIONS = ""
,   PIVOT_CHILD_SELECTIONS = ""
,   PIVOT_CHILD_IDS_SELECTIONS = ""
,   COLUMNS_SELECTIONS = ""
,   COLUMNS_IDS_SELECTIONS = ""
,   COLUMNS_CHILD_IDS_SELECTIONS = ""
,   ROWS_SELECTIONS = ""
,   ROWS_IDS_SELECTIONS = ""
,   ROWS_CHILD_IDS_SELECTIONS = ""
,   DATE_SELECTIONS = ""
,   FILTER_SELECTIONS = ""
,   AVERAGE_SELECTIONS = ""
,   STOPWORDS_SELECTIONS = "";

function getObjects(obj, key, val) {
    var objects = [];
    for(var i in obj) {
        if(!obj.hasOwnProperty(i)) {
            continue;
        }
        if(typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if(i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

// =========================================================
// Set List View toolbar
// =========================================================
var set_toolbar_buttons = function() {
    var _GRID = _gridListView.data("kendoGrid");
    _GRID.wrapper.find(".toolbar button").each(function() {
        var thisAction = $(this).data("action");
        $(this).kendoButton({
            click: function() {
                switch(thisAction) {
                    case "clear":
                        $(".window-clear-grid").data("kendoWindow").center().open();
                        break;
                    case "batch-pptx":
                        windowSaveFile.center().open();
                        windowSaveFile.element.find(".save-options").show();
                        windowSaveFile.element.find("input:text").val("");
                        windowSaveFile.element.find("button.export-batch").data("kendoButton").enable(false);
                        var lengthList = _GRID.content.find("tr").length
                        ,   dateType = parseInt($("select.select-date-period").data("kendoDropDownList").value());
                        $(".list-items").text(lengthList);
                        $(".save-options td input[name=export-list]").prop({"disabled": false});
                        $(".save-options td").find("input[name=export-qbatch], input[name=export-abatch]").prop({
                            "checked": ""
                        });
                        if(dateType == 0) {
                            $(".save-options td input[name^=export-type]:eq(2)").prop({
                                "checked": "checked"
                            });
                        }
                        if(dateType == 1) {
                            $(".save-options td input[name^=export-type]:eq(1)").prop({
                                "checked": "checked"
                            });
                        }
                        if(lengthList == 0) {
                            $(".save-options td input[name^=export-type]:eq(0)").prop({
                                "disabled": true
                            });
                        } else {
                            $(".save-options td input[name^=export-type]:eq(0)").prop({
                                "disabled": false
                            ,   "checked": "checked"
                            });
                        }
                        if(get_selected_dates().length == 0) {
                            $("li.no-selection").show().siblings().hide();
                            $(".save-options td input[name^=export-type].batch-option").prop({
                                "disabled": true
                            });
                        } else {
                            $("li.no-selection").hide().siblings().show();
                            $(".save-options td input[name^=export-type].batch-option").prop({
                                "disabled": false
                            });
                        }
                        break;
                }
            }
        });
    });
    // CATEGORY AVERAGE SELECTOR
    _GRID.wrapper.find(".toolbar select.select-average").kendoDropDownList({
        animation: false
    ,   dataTextField: "text"
    ,   dataValueField: "value"
    ,   index: 0
    ,   dataSource: vDataMetricsCats
    ,   template: '<span aria-hidden="true"></span>&nbsp;${text}'
    ,   valueTemplate: '<span aria-hidden="true" class="icon-rulers"></span>&nbsp;${text}'
    ,   change: function(e) {
            load_xtab_data();
        }
    });
    // DATE GROUPING SELECTOR
    _GRID.wrapper.find(".toolbar select.select-date-period").kendoDropDownList({
        animation: false
    ,   dataTextField: "text"
    ,   dataValueField: "value"
    ,   index: 1
    ,   dataSource: [
            {value: 1, text: "by Year"}
        ,   {value: 2, text: "by Quarter"}
        ]
    ,   valueTemplate: '<span aria-hidden="true" class="icon-calendar4"></span>&nbsp;${text}'
    ,   change: function(e) {
            change_listDATE_SELECTIONS();
            load_xtab_data();
        }
    });
    // CONFIDENCE SELECTOR
    _GRID.wrapper.find(".confidence-level").kendoDropDownList({
        animation: false
    ,   valueTemplate: '<span aria-hidden="true" class="icon-balance"></span>&nbsp;${value}'
    ,   change: function(e) {
            load_xtab_data();
        }
    });
    _GRID.wrapper.find(".k-header > .toolbar.toolbar-xtab").children(".tb-textify").not(".tb-datapull").hide();
}

// =========================================================
// SET LISTVIEW DROPPABLES
// =========================================================
var set_listview_droppables = function() {
    // -------------------------------------
    // LISTVIEW SET DROPPABLES
    // -------------------------------------
    $("#grid-listview .k-grid-content").addClass("tb-cell-c").droppable({
        scope: "xtab-draggable"
    ,   drop: function(e, ui) {
            $(e.target).removeClass("compset-hover").css({
                "color": ""
            });
            vCurrentE = e;
            _currentProdDrag = ui;
            vCurrentThis = this;
            xtab_draggable_drop(e, ui, this);
//            windowProdDrop.center().open();
        }
    ,   over: function(e, ui) {
            $(e.target).addClass("compset-hover").css({
                "color": "#FFF"
            });
        }
    ,   out: function(e, ui) {
            $(e.target).removeClass("compset-hover").css({
                "color": ""
            });
        }
    });
}

// =========================================================
// Clear XTab PowerGrid
// =========================================================
var clear_xtab_grid = function() {
    close_active_window();
    $(".k-grid:visible .tb-droppable-cell").each(function() {
        reset_droppable($(this));
    });
    $(".k-grid:visible").removeClass("tb-textify tb-nestedxtab").addClass("tb-xtab").attr({
        "data-action": "xtab"
    });
    uberMenu.wrapper.find(">li:eq(0), >li:eq(1), >li:eq(2)").slideDown(250);
    $(".k-grid:visible .k-grid-toolbar .toolbar-droppables").show().siblings().removeClass("noborder-bottom");
    resize_xtab_grid();
}

// =========================================================
// Change date selection feedback
// =========================================================
var change_listDATE_SELECTIONS = function() {
    var thisGrid = $(".k-grid:visible").data("kendoGrid")
    ,   thisDrop = $(".k-grid:visible").find(".toolbar select.select-date-period").data("kendoDropDownList")
    ,   thisDates = treeDATES.getCheckedItems()
    ,   theseDates = [];
    if(thisDrop.value() == 1) {
        for(var i = 1; i < thisDates.length ; i++) {
            if($.inArray(thisDates[i].year_id, theseDates) == -1) {
                theseDates.push(thisDates[i].year_id);
            }
        }
    } else if(thisDrop.value() == 2){
        for(var i = 1; i < thisDates.length ; i++) {
            if($.inArray(thisDates[i].quarter_id, theseDates) == -1) {
                if(typeof thisDates[i].quarter_id !== "undefined") {
                    theseDates.push(thisDates[i].quarter_id);
                }
            }
        }
    }
    thisGrid.wrapper.find(".tb-cell-a").attr({
        "data-axis-source": "dates"
    ,   "data-ids": thisDrop.value()
    ,   "data-child-ids": theseDates.join()
    });
}

// =========================================================
// Set Textify toolbar
// =========================================================
var set_textify_toolbar = function() {
    var _gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper;
    // -------------------------------------
    // TEXTIFY DATE TYPE SELECTOR
    // -------------------------------------
    var dateTypeSelect = _gridDeepDive.find("select.select-datetype").kendoDropDownList({
        animation: false
    ,   change: function(e) {
            _gridDeepDive.find(".tb-cell-a").attr("data-ids", _gridDeepDive.find("select.select-datetype").val());
            vCELL_A_IDS_IDX = _gridDeepDive.find("select.select-datetype").data("kendoDropDownList").selectedIndex;
            var dataDateSource = build_dates_dropdown_source();
            _gridDeepDive.find("select.select-dates").data("kendoMultiSelect").setDataSource(dataDateSource);
        }
    }).data("kendoDropDownList");
    dateTypeSelect.select(vCELL_A_IDS_IDX);

    // -------------------------------------
    // TEXTIFY DATE MULTISELECT
    // -------------------------------------
    var dataDateSource = build_dates_dropdown_source();
    var multiSelect = _gridDeepDive.find("select.select-dates").kendoMultiSelect({
        change: function(e) {
            CELL_A_CHILD_IDS_IDX = _gridDeepDive.find("select.select-dates").data("kendoMultiSelect").value().join();
            _gridDeepDive.find(".tb-cell-a").attr({
                "data-ids": dateTypeSelect.value()
            ,   "data-child-ids": CELL_A_CHILD_IDS_IDX
            });
            resize_xtab_grid();
        }
    ,   autoClose: false
    ,   dataSource: dataDateSource
    ,   dataValueField: "value"
    ,   dataTextField: "text"
    }).data("kendoMultiSelect");
    var _VIEW = multiSelect.dataSource.view()
    ,   _PREV_SELS = CELL_A_CHILD_IDS_IDX.split(",").map(Number)
    ,   _CURR_SELS = [];
    for(var i = 0 ; i < _VIEW.length ; i++) {
        if($.inArray(parseInt(_VIEW[i].value), _PREV_SELS) !== -1) {
            _CURR_SELS.push(parseInt(_VIEW[i].value));
        }
    }
    if(_CURR_SELS.length == 0 && multiSelect.element.is(":visible")) {
        _CURR_SELS.push(multiSelect.dataSource.view()[multiSelect.dataSource.view().length - 1].value);
    }
    _gridDeepDive.find(".tb-cell-a").attr("data-child-ids", _CURR_SELS.join());
    if(_PREV_SELS.length == 1) {
        if(_PREV_SELS[0] !== 0) {
            multiSelect.value(_CURR_SELS);
        }
    }

    // -------------------------------------
    // TEXTIFY QUESTION TYPE
    // -------------------------------------
    _gridDeepDive.find("select.select-cloudtype").kendoDropDownList({
        animation: false
    ,   change: function(e) {
            _gridDeepDive.find(".tb-cell-c").attr({
                "data-ids": _gridDeepDive.find("select.select-cloudtype").val()
            });
            CELL_C_IDS_IDX = _gridDeepDive.find("select.select-cloudtype").data("kendoDropDownList").selectedIndex;
        }
    ,   template: '<span aria-hidden="true" class="icon-stop2 color-${value}"></span>&nbsp;${text}'
    ,   valueTemplate: '<span aria-hidden="true" class="icon-stop2 color-${value}"></span>&nbsp;${text}'
    }).data("kendoDropDownList").select(CELL_C_IDS_IDX);
    _gridDeepDive.find(".tb-cell-c").attr({
        "data-ids": _gridDeepDive.find("select.select-cloudtype").data("kendoDropDownList").value()
    });
    // -------------------------------------
    // TEXTIFY WORD COMBOS
    // -------------------------------------
    _gridDeepDive.find("select.select-word-combos").kendoDropDownList({
        animation: false
    ,   change: function(e) {
            _gridDeepDive.find(".tb-cell-c").attr({
                "data-child-ids": _gridDeepDive.find("select.select-word-combos").val() + "," + _gridDeepDive.find("select.select-min-freq").val()
            });
            CELL_C_CHILD_IDS_IDX1 = _gridDeepDive.find("select.select-word-combos").data("kendoDropDownList").value();
        }
    }).data("kendoDropDownList").select(CELL_C_CHILD_IDS_IDX1 - 1);
    // -------------------------------------
    // TEXTIFY FREQUENCY SELECTOR
    // -------------------------------------
    var _VALUES = [1,2,3,4,5,6,7,8,9,10,15,20,25,30,35,40,45,50];
    for(var i = 0 ; i < _VALUES.length ; i++) {
        var freqSel = plural  = "";
        if(i > 1) {
            plural = "s";
        }
        if(i == 5) {
            freqSel = ' selected="selected"';
        }
        _gridDeepDive.find("select.select-min-freq").append("<option value='" + _VALUES[i] + "' " + freqSel + ">Frequency >=" + _VALUES[i] + "</option>");
    }
    _gridDeepDive.find("select.select-min-freq").kendoDropDownList({
        animation: false
    ,   change: function(e) {
            _gridDeepDive.find(".tb-cell-c").attr({
                "data-child-ids": _gridDeepDive.find("select.select-word-combos").val() + "," + _gridDeepDive.find("select.select-min-freq").val()
            });
            CELL_C_CHILD_IDS_IDX2 = _gridDeepDive.find("select.select-min-freq").data("kendoDropDownList").value();
        }
    }).data("kendoDropDownList").select(CELL_C_CHILD_IDS_IDX2 - 1);
    _gridDeepDive.find(".tb-cell-c").attr({
        "data-child-ids": CELL_C_CHILD_IDS_IDX1 + "," + CELL_C_CHILD_IDS_IDX2
    });
    // -------------------------------------
    // TEXTIFY SUBMIT
    // -------------------------------------
    btnTextifySubmit = _gridDeepDive.find(".submit-textify").unbind().bind("click", function() {
        load_xtab_data();
    });
}

// =========================================================
// Set Nested XTab toolbar
// =========================================================
var set_nestedxtab_labels = function() {
    var gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper
    ,   dateRange = gridDeepDive.find("div.range-nestedxtab").not(".k-widget").data("kendoRangeSlider")
    ,   dateRangeYears = []
    ,   dateRangeQuarters = []
    ,   dateRangeMonths = []
    ,   dateRangeYearsIds = []
    ,   dateRangeQuartersIds = []
    ,   dateRangeMonthsIds = []
    ,   dateRangeDates;
    DATES.data()[0].items.forEach(function(h) {
        dateRangeYears.push(h.text);
        dateRangeYearsIds.push(h.year_id);
        h.items.forEach(function(j) {
            dateRangeQuarters.push(j.year + " " + j.text.replace("uarter ", ""));
            dateRangeQuartersIds.push(j.quarter_id);
            j.items.forEach(function(k) {
                dateRangeMonths.push(k.year + " " + k.text.substr(0, 3));
                dateRangeMonthsIds.push(k.month_id);
            });
        });
    });
    var dateIds = [dateRangeYearsIds, dateRangeQuartersIds, dateRangeMonthsIds ];
    if(dateRange) {
        dateRange.destroy();
        gridDeepDive.find("div.range-nestedxtab.k-widget").replaceWith(gridDeepDive.find("div.range-nestedxtab").not(":visible"));
    }
    var dateRangeUse = dateRangeQuarters
    ,   minusHowMany = 0;
    switch(vCELL_B_IDS_IDX) {
        case 0:
            dateRangeUse = dateRangeYears;
            minusHowMany = 1;
            break;
        case 1:
            dateRangeUse = dateRangeQuarters;
            minusHowMany = 3;
            break;
        case 2:
            dateRangeUse = dateRangeMonths;
            minusHowMany = 5;
            break;
    }
    JARTREND_SELECTION_START = (dateRangeUse.length - minusHowMany);
    JARTREND_SELECTION_END = dateRangeUse.length;
    var dateSlider = gridDeepDive.find("div.range-nestedxtab").show().kendoRangeSlider({
        min: 1
    ,   max: (vCELL_B_IDS_IDX == 0) ? dateRangeYears.length : (vCELL_B_IDS_IDX == 1) ? dateRangeQuarters.length : dateRangeMonths.length
    ,   largeStep: (vCELL_B_IDS_IDX == 2) ? 3 : 1
    ,   tooltip: {enabled: false}
    ,   slide: function(e) {
            $(".feedback-daterange").text(dateRangeUse[e.values[0] - 1] + " thru " + dateRangeUse[e.values[1] - 1]);
        }
    ,   selectionStart: JARTREND_SELECTION_START
    ,   selectionEnd: JARTREND_SELECTION_END
    ,   change: function(e) {
            if( vCELL_B_IDS_IDX == 3 ) return;
            var startEnd = gridDeepDive.find("div.range-nestedxtab").not(".k-widget").data("kendoRangeSlider").values()
            ,   ids = [];
            for(var j = startEnd[0] ; j <= startEnd[1] ; j++) {
                ids.push(dateIds[vCELL_B_IDS_IDX][j - 1]);
            }
            gridDeepDive.find("select.select-product").data("kendoDropDownList").trigger("change");
            gridDeepDive.find(".tb-cell-a").attr("data-axis-source", "products");
            gridDeepDive.find(".tb-cell-b").attr({
                "data-axis-source": "dates|metrics"
            ,   "data-child-ids": ids.join(",") + "|"
            });
            gridDeepDive.find(".tb-cell-c").attr("data-axis-source", "metrics");
            JARTREND_SELECTION_START = startEnd[0];
            JARTREND_SELECTION_END = startEnd[1];
        }
    });

    var sliderItems = dateSlider.siblings(".k-slider-items");
    $.each(dateRangeUse, function(index, value){
        var item = sliderItems.find("li:eq(" + (index) + ")");
        item.attr("title", value);
        item.find("span").text(value);
    });
    return dateSlider;
}
var set_nestedxtab_toolbar = function() {
    var gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper;
    reset_droppable(gridDeepDive.find(".tb-cell-a"));
    if(gridDeepDive.attr("data-action") == "nestedxtab") {
        gridDeepDive.find(".k-grid-toolbar .toolbar-droppables").hide().siblings().addClass("noborder-bottom");
    }
    var productSelect = gridDeepDive.find("select.select-product").kendoDropDownList({
        animation: false
    ,   dataSource: vDataProductsFlat
    ,   dataValueField: "id"
    ,   dataTextField: "text"
    ,   change: function(e) {
            gridDeepDive.find(".tb-cell-a").attr({"data-ids": 3, "data-child-ids": e.sender.value()});
            vCELL_A2_IDS_IDX = gridDeepDive.find("select.select-product").data("kendoDropDownList").selectedIndex;
        }
    }).data("kendoDropDownList");
    productSelect.select(vCELL_A2_IDS_IDX);
    var dateTypeSelect = gridDeepDive.find("select.select-datetypenested").kendoDropDownList({
        animation: false
    ,   change: function(e) {
            $('#nestedxtab-range-selector').remove();
            productSelect.trigger("change");
            vCELL_B_IDS_IDX = gridDeepDive.find("select.select-datetypenested").data("kendoDropDownList").selectedIndex;
            if( vCELL_B_IDS_IDX < 3 ) {
              gridDeepDive.find(".tb-cell-b").attr("data-ids", e.sender.value() + "|");
              set_nestedxtab_labels();
              gridDeepDive.find("div.range-nestedxtab").not(".k-widget").data("kendoRangeSlider").trigger("slide", {values: gridDeepDive.find("div.range-nestedxtab").not(".k-widget").data("kendoRangeSlider").values()});
              gridDeepDive.find("div.range-nestedxtab").not(".k-widget").data("kendoRangeSlider").trigger("change");
            } else {
              set_nestedxtab_daterange();
            }
        }
    }).data("kendoDropDownList");
    dateTypeSelect.select(vCELL_B_IDS_IDX);
    var dateSlider = set_nestedxtab_labels();
    productSelect.trigger("change");
    dateTypeSelect.trigger("change");
    dateSlider.data("kendoRangeSlider").trigger("change", {values: gridDeepDive.find("div.range-nestedxtab").not(".k-widget").data("kendoRangeSlider").values()});
    resize_xtab_grid();
}

var set_nestedxtab_daterange = function() {
    var gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper,
        dateRange = gridDeepDive.find("div.range-nestedxtab.k-slider");
    if( dateRange ) {
      $(dateRange).hide();
    }
    create_nestedxtab_daterange( $(".feedback-daterange:visible") );
    $('#nestedxtab-range-selector input').first().trigger( 'change' );
}

var create_nestedxtab_daterange = function( sibling ) {

  $(sibling).after(  '' +
    '<div id="nestedxtab-range-selector" style="font-size: 11px; margin-top: 5px">' +
      'From:&nbsp;<input id="nestedxtab-date-from" style="width: 120px; margin-right: 10px"/>' +
      'To:&nbsp;<input id="nestedxtab-date-to" style="width: 120px"/> ' +
      '</div>' );
  $("#nestedxtab-date-from, #nestedxtab-date-to").each(function(i) {
              $(this).kendoDatePicker({
                  min: MINMAX[0]
              ,   max: MINMAX[1]
              ,   value: MINMAX[i]
              ,   change: nestedxtab_range_changed
              });
    });
  $("#nestedxtab-date-from, #nestedxtab-date-to").change( nestedxtab_range_changed );
}

var nestedxtab_range_changed = function ( e ) {
    var gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper,
        from = $('#nestedxtab-date-from').val();
        to = $('#nestedxtab-date-to').val();

    $(".feedback-daterange").text( from + " thru " + to );

    gridDeepDive.find("select.select-product").data("kendoDropDownList").trigger("change");
    gridDeepDive.find(".tb-cell-a").attr("data-axis-source", "products");
    gridDeepDive.find(".tb-cell-b").attr({
    "data-axis-source": "dates|metrics"
            ,   "data-ids": '4|'
            ,   "data-child-ids": from + '-' + to
    });
    gridDeepDive.find(".tb-cell-c").attr("data-axis-source", "metrics");

}

// =========================================================
// Set XTab toolbar
// =========================================================
var set_xtab_toolbar = function() {
    var gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper;
    // -------------------------------------
    // BUTTONS
    // -------------------------------------
    gridDeepDive.find(".toolbar button").each(function() {
        var thisAction = $(this).data("action");
        $(this).kendoButton({
            click: function(e) {
                switch(thisAction) {
                    case "clear":
                        $(".window-clear-xtab").data("kendoWindow").center().open();
                        break;
                    case "stats":
                        gridDeepDive.find(".stat-test, .identifier").toggle();
                        break;
                    case "submitxtab":
                        load_xtab_data();
                        break;
                    default:
                        break;
                }
            }
        ,   enable: (thisAction == "xlsx") ? false : true
        });
    });
    gridDeepDive.find(".confidence-level").kendoDropDownList({
        animation: false
    ,   valueTemplate: '<span aria-hidden="true" class="icon-balance"></span>&nbsp;${value}'
    ,   change: function(e) {
            load_xtab_data();
        }
    });
}

// =========================================================
// BUILD TEXT ANALYTICS SELECTORS DATASOURCE
// =========================================================
var build_dates_dropdown_source = function() {
    var dSource = [], dateType = 1;
    if($("#grid-deepdive").is(":visible")) {
        if($("#grid-deepdive select.select-datetype").data("kendoDropDownList")) {
            dateType = $("#grid-deepdive select.select-datetype").data("kendoDropDownList").selectedIndex;
        }
    }
    if(dateType == 0) {
        treeDATES.element.find("input[data-year-id!=undefined][data-quarter-id=undefined][data-month-id=undefined]").each(function() {
            if($(this).attr("data-year-id") !== "0") {
                dSource.push({
                    value: $(this).attr("data-year-id")
                ,   text: $(this).parent().next().text()
                });
            }
        });
    } else if(dateType == 1) {
        treeDATES.element.find("input[data-year-id!=undefined][data-quarter-id!=undefined][data-month-id=undefined]").each(function() {
            dSource.push({
                value: $(this).attr("data-quarter-id")
            ,   text: treeDATES.element.find("input[data-year-id=" + $(this).attr("data-year-id") + "]:first").parent().next().text() + " " + $(this).parent().next().text().replace("Quarter ", "Q")
            });
        });
    } else if(dateType == 2) {
        treeDATES.element.find("input[data-year-id!=undefined][data-quarter-id!=undefined][data-month-id!=undefined]").each(function() {
            dSource.push({
                value: $(this).attr("data-month-id")
            ,   text: treeDATES.element.find("input[data-year-id=" + $(this).attr("data-year-id") + "]:first").parent().next().text() + " " + $(this).parent().next().text().replace("Quarter ", "Q")
            });
        });
    }
    return dSource;
}

// =========================================================
// BUILD TEXT ANALYTICS SELECTORS
// =========================================================
var build_dates_dropdown = function() {
    var _GRID = $(".k-grid:visible").data("kendoGrid");
}

// =========================================================
// Set XTAB draggables
// =========================================================
var xtab_draggables = function(tree) {
    if(typeof tree !== "undefined") {
        tree.element.find(".k-item").not("[data-role=draggable]").draggable({
            scope: "xtab-draggable"
        ,   appendTo: "body"
        ,   helper: "clone"
        ,   containment: "window"
        ,   zIndex: 11001
        ,   drag: function(e, ui) {
                vCurrentDraggable = ui.helper.context;
            }
        }).data("draggable");
        kendo.ui.progress($("body"), 0);
    }
}

// =========================================================
// Force checkbox select; clear k-state
// =========================================================
var treeview_post_select = function(e) {
    var _e = e, thisGrid = $(".k-grid:visible");
    setTimeout(function() {
        $(":checkbox:first", $(_e.node)).click();
        if(thisGrid.attr("data-action") == "text") {
            $(".tb-cell-b").attr({
                "data-ids": $(_e.node).find(".treeview-product").attr("data-cat_id")
            ,   "data-child-ids": $(_e.node).find(".treeview-product").attr("data-product_id")
            });
        } else {
            $(e.node).find("span.k-in").removeClass("k-state-selected k-state-hover k-state-focused");
        }
    }, 250);
}

// =========================================================
// Resize XTAB grid and its content
// =========================================================
var update_product_counts = function() {
    $("#tree-products").data("kendoTreeView").element.find(".children-count").each(function() {
        $(this).text($(this).parents(".k-item:first").find(".active-item").length);
    });
}

// =========================================================
// Apply comparison against benchmark
// =========================================================
var benchmark_parity = function(destinationgridSource, PARITY_BENCHMARK) {
    $("#workspace").find(".template-parity").remove();
    _gridListView.find(".k-grid-content tr").each(function(i) {
        $(".comparison-cell", this).each(function(j) {
            $(this).parent().removeClass("template-parity-above template-parity-below template-parity- template-parity-undefined");
            if(_gridListView.data("kendoGrid").dataSource.data().length > 0) {
                var k = 0;
                for(var obj in PARITY_BENCHMARK[i]) {
                    if(PARITY_BENCHMARK[i].hasOwnProperty(obj)) {
                        if(k == j) {
                            if(PARITY_BENCHMARK[i][obj]["parityA"] !== "") {
                                $(this).parent().addClass("template-parity-" + PARITY_BENCHMARK[i][obj]["parityA"]);
                            }
                            break;
                        }
                        k++;
                    }
                }
            }
        });
    });
}

// =========================================================
// Monitor for user list changes
// =========================================================
var check_user_list = function() {
    var _bool_changed = false;
    for(var i = 0 ; i < vDataUserList.data().length ; i++) {
        for(var j = 0 ; j < $(".access-username").length ; j++) {
            if(parseInt($(".user-id:eq(" + j + ")").text()) == vDataUserList.data()[i].id) {
                if(parseInt($("input.access-company:eq(" + j + ")").val()) !== vDataUserList.data()[i].company || $(".access-username:eq(" + j + ")").val() !== vDataUserList.data()[i].name || $(".access-email:eq(" + j + ")").val() !== vDataUserList.data()[i].email || parseInt($("input.access-level:eq(" + j + ")").val()) !== vDataUserList.data()[i].access) {
                    _bool_changed = true;
                }
            }
        }
    }
    if(_bool_changed) {
        $(".update-user-admin").addClass("update-true");
    } else {
        $(".update-user-admin").removeClass("update-true");
    }
}

// =========================================================
// Retrieve user-selected dates
// =========================================================
var get_selected_dates = function() {
    var selectedDates = [];
//    switch(_tabsDates.select().index()) {
    if($("select.select-date-period").data("kendoDropDownList")) {
        switch(parseInt($("select.select-date-period").data("kendoDropDownList").value())) {
        /*
                case 0:
                    var listMonths = $("#tree-dates").data("kendoTreeView").getCheckedItems();
                    for(var i = 0 ; i < listMonths.length ; i++) {
                        if(typeof listMonths[i].month_id !== "undefined") {
                            selectedDates.push(listMonths[i].month_id);
                        }
                    }
                    break;
                case 1:
                    var _f = $("#date-from").data("kendoDatePicker").value()
                    ,   _t = $("#date-to").data("kendoDatePicker").value()
                    ,   _dateFrom = _f.getFullYear() + ("0" + (_f.getMonth() + 1)).substr(-2) + ("0" + _f.getDate()).substr(-2)
                    ,   _dateTo = _t.getFullYear() + ("0" + (_t.getMonth() + 1)).substr(-2) + ("0" + _t.getDate()).substr(-2);
                    selectedDates = [_dateFrom, _dateTo];
                    break;
        */
                case 2:
                    var listQuarters = $("#tree-dates").data("kendoTreeView").getCheckedItems();
                    for(var i = 0 ; i < listQuarters.length ; i++) {
                        if(typeof listQuarters[i].quarter_id !== "undefined") {
                            if($.inArray(listQuarters[i].quarter_id, selectedDates) == -1) {
                                selectedDates.push(listQuarters[i].quarter_id);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
    } else {
        if($(".tb-cell-a[data-axis-source='dates']").length > 0 && !$("#tabs-dates-2").is(":visible")) {
            selectedDates.push($(".k-grid:visible .tb-cell-a").attr("data-child-ids"));
        } else if($("td[data-axis-source='dates']").length == 0) {
            if($("#tree-dates").is(":visible")) {
                var listMonths = $("#tree-dates").data("kendoTreeView").getCheckedItems();
                for(var i = 0 ; i < listMonths.length ; i++) {
                    if(typeof listMonths[i].month_id !== "undefined") {
                        if($.inArray(listMonths[i].month_id, selectedDates) == -1) {
                            selectedDates.push(listMonths[i].month_id);
                        }
                    }
                }
            } else if($("div.draggable-daterange").is(":visible")) {
                selectedDates = [
                    kendo.toString(new Date($("#date-from").val().split("/")[2], ("0" + ($("#date-from").val().split("/")[0] - 1)).substr(-2), $("#date-from").val().split("/")[1]), "yyyyMMdd")
                ,   kendo.toString(new Date($("#date-to").val().split("/")[2], ("0" + ($("#date-to").val().split("/")[0] - 1)).substr(-2), $("#date-to").val().split("/")[1]), "yyyyMMdd")
                ];
            }
        } else if($(".tb-cell-a[data-axis-source='dates']").length > 0 && $("#tabs-dates-2").is(":visible")) {
            selectedDates.push(kendo.toString(new Date($("#date-from").val().split("/")[2], ($("#date-from").val().split("/")[0] - 1), $("#date-from").val().split("/")[1]), "yyyyMMdd"));
            selectedDates.push(kendo.toString(new Date($("#date-to").val().split("/")[2], ($("#date-to").val().split("/")[0] - 1), $("#date-to").val().split("/")[1]), "yyyyMMdd"));
        // -------------------------------------
        // DRAGGABLE=DATE RANGE & DROPPABLE=COLUMNS
        // -------------------------------------
        } else if($("tb-cell-b[data-axis-source='dates']").length > 0) {
            selectedDates = [
                kendo.toString(new Date($("#date-from").val().split("/")[2], ("0" + ($("#date-from").val().split("/")[0] - 1)).substr(-2), $("#date-from").val().split("/")[1]), "yyyyMMdd")
            ,   kendo.toString(new Date($("#date-to").val().split("/")[2], ("0" + ($("#date-to").val().split("/")[0] - 1)).substr(-2), $("#date-to").val().split("/")[1]), "yyyyMMdd")
            ];
        // -------------------------------------
        // DRAGGABLE=DATE & DROPPABLE=ROWS
        // -------------------------------------
        } else if($(".tb-cell-c[data-axis-source='dates']").length > 0) {
            selectedDates = $(".k-grid:visible .tb-cell-c[data-axis-source='dates']").attr("data-child-ids").split(",").map(Number);
        }
    }
    return selectedDates;
}

var get_date_filter = function() {

    var filter = { 'date_type': null, 'dates': null };

    switch(_tabsDates.select().index()) {
      case 1:
        filter.date_type = 'range';
        var from = kendo.toString(new Date($("#date-from").val().split("/")[2], ("0" + ($("#date-from").val().split("/")[0] - 1)).substr(-2), $("#date-from").val().split("/")[1]), "yyyyMMdd");
        var to = kendo.toString(new Date($("#date-to").val().split("/")[2], ("0" + ($("#date-to").val().split("/")[0] - 1)).substr(-2), $("#date-to").val().split("/")[1]), "yyyyMMdd");
        filter.dates = from + '|' + to;
        break;
      case 0:
        filter.date_type = 'months';
        filter.dates = [];
        var listMonths = $("#tree-dates").data("kendoTreeView").getCheckedItems();
        for(var i = 0 ; i < listMonths.length ; i++) {
          if(typeof listMonths[i].month_id !== "undefined") {
              filter.dates.push(listMonths[i].month_id);
            }
        }
        break;
  }

  return filter;
}

// =========================================================
// Retrieve user-selected stores
// =========================================================
var get_selected_stores = function() {
    var _storeIds = [];
    $("#list-restaurants > div.store-item").each(function() {
        if(typeof $(this).attr("data-composite-id") !== "undefined") {
            var _pasteIds = $(this).attr("data-composite-id").split(",").map(Number);
            _storeIds = $.merge(_storeIds, _pasteIds);
        } else {
            _storeIds.push(parseInt($(this).attr("data-item-id")));
        }
    });
    return _storeIds;
}

// =========================================================
// Kill the list with extreme prejudice
// =========================================================
var remove_pasted_stores = function() {
    if( $("#list-restaurants > div.store-item").length ) {
      $("#list-restaurants > div.store-item").remove();
      load_xtab_data();
    }
}

// =========================================================
// Update Scorecard data
// =========================================================
var update_scorecard = function(thisID) {
    $(".export-pptx").data("kendoButton").enable(false);
    $.ajax({
        dataType: "json"
    ,   url: siteBase + "index.php?/scorecardjson/index"
    ,   data: {
            product_id: [thisID]
        ,   date_type: get_selected_datetype()
        ,   scorecard_id: 1
        ,   "wbrs_test": $.cookie("wbrs_test_token")
        ,   batch_mode: 0
        }
    ,   type: "POST"
    ,   success: function(result) {
            var _SCORECARD = result.SCORECARD
            ,   EXPORT_ID = result.EXPORT_ID
            ,   deferreds = []
            ,   CELL_ID = []
            ,   _RESULT = [];
            SCORECARD_KEY = result.SCORECARD_KEY;
            for(var i = 0 ; i < _SCORECARD.length ; i++) {
                CELL_ID.push(_SCORECARD[i].slide_section_id);
            }
            var execute_queue = function(index) {
                var myForm = new FormData();
                myForm.append("DATE_IDS", $("[data-axis-source=dates]").attr("data-ids"));
                myForm.append("DATE_CHILD_IDS", (get_selected_dates().length == 0) ? $("[data-axis-source=dates]").attr("data-child-ids") : get_selected_dates());
                myForm.append("FILTERS", get_selected_filters());
                myForm.append("CONFIDENCE", get_confidence_level());
                myForm.append("IS_SCORECARD", 1);
                myForm.append("PRODUCT_ID", thisID);
                myForm.append("CELL_ID", CELL_ID[index]);
                myForm.append("STORES", get_selected_stores());
                myForm.append("EXPORT_ID", EXPORT_ID);
                myForm.append("wbrs_test", $.cookie("wbrs_test_token"));
                $.ajax({
                    url: siteBase + "index.php?/datajson/index"
                ,   data: myForm
                ,   processData: false
                ,   contentType: false
                ,   type: "POST"
                ,   success: function(result) {
                        _RESULT.push({section_id: CELL_ID[index], result: result});
                        for(var i = 0 ; i < _RESULT.length ; i++) {
                            var thisSection = _RESULT[i].section_id;
                            if(typeof result.SCORECARD_META !== "undefined") {
                                if(result.SCORECARD_META !== null) {
                                    gridster.$widgets.eq(result.SCORECARD_META.cell).empty();
                                    switch(result.SCORECARD_META.type) {
                                        case "info":
                                            gridster.$widgets.eq(result.SCORECARD_META.cell).html(result.RAW_DATA);
                                            break;
                                        case "table":
                                        case "table-noheader":
                                            gridster.$widgets.eq(result.SCORECARD_META.cell).html(result.SCORECARD_HTML).find("." + result.SCORECARD_META.findClass).kendoGrid().parent().prev(".k-grid-header").css({
                                                display: (result.SCORECARD_META.type == "table-noheader") ? "none" : ""
                                            });
                                            gridster.$widgets.eq(result.SCORECARD_META.cell).children().css({
                                                height: "100%"
                                            }).find(".k-grid-content").css({
                                                height: gridster.$widgets.eq(result.SCORECARD_META.cell).innerHeight() - gridster.$widgets.eq(result.SCORECARD_META.cell).find(".k-grid-header").outerHeight()
                                            });
                                            if(result.SCORECARD_META.type == "table-noheader") {
                                                setTimeout(function() {
                                                    gridster.$widgets.eq(result.SCORECARD_META.cell).children().css({
                                                        height: "100%"
                                                    }).find(".k-grid-content").css({
                                                        height: "100%"
                                                    });
                                                }, 250);
                                            }
                                            if(result.SCORECARD_META.smallFont) {
                                                gridster.$widgets.eq(result.SCORECARD_META.cell).children().addClass("small-font");
                                            }
                                            if(result.SCORECARD_META.textCenter) {
                                                gridster.$widgets.eq(result.SCORECARD_META.cell).children().addClass("text-center");
                                            }
                                            break;
                                        case "chart":
                                            var _HC = result.HIGHCHARTS;
                                            if(_HC.plotOptions.series) {
                                                if(_HC.plotOptions.series.dataLabels) {
                                                    if(_HC.plotOptions.series.dataLabels.JSformatter) {
                                                        _HC.plotOptions.series.dataLabels.formatter = eval("(" + _HC.plotOptions.series.dataLabels.JSformatter + ")");
                                                    }
                                                }
                                            }
                                            for(var obj in _HC.series) {
                                                if(_HC.series.hasOwnProperty(obj)) {
                                                    if(_HC.series[obj].dataLabels) {
                                                        if(_HC.series[obj].dataLabels.JSformatter) {
                                                            _HC.series[obj].dataLabels.formatter = eval("(" + _HC.series[obj].dataLabels.JSformatter + ")");
                                                        }
                                                    } else {
                                                        for(var obj2 in _HC.series[obj].data) {
                                                            if(_HC.series[obj].data.hasOwnProperty(obj2)) {
                                                                if(_HC.series[obj].data[obj2].dataLabels) {
                                                                    if(_HC.series[obj].data[obj2].dataLabels.JSformatter) {
                                                                        _HC.series[obj].data[obj2].dataLabels.formatter = eval("(" + _HC.series[obj].data[obj2].dataLabels.JSformatter + ")");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            gridster.$widgets.eq(result.SCORECARD_META.cell).addClass(result.SCORECARD_META.widget_class).highcharts(_HC);
                                            break;
                                    }
                                }
                            }
                            break;
                        }
                        index++;
                        if(CELL_ID[index] != undefined) {
                            execute_queue(index);
                        } else {
                            $(".export-pptx").data("kendoButton").enable(true);
                            $(".download-pptx").fadeIn("fast");
                        }
                    }
                ,   dataType: "json"
                });
            };
            var index = 0;
            execute_queue(index);
        }
    });
}

// =========================================================
// Process XTAB after each drop
// * e = Droppable, ui = Draggable, _this = Target
// =========================================================
var xtab_draggable_drop = function(e, ui, _this) {
    vCurrentE = e
,   _currentProdDrag = ui
,   vCurrentThis = _this;
    $(vCurrentThis).css({
        "background-color": ""
    }).find(".toolbar-droppable").css({
        color: ""
    });
    if(ui.draggable.hasClass("draggable-daterange")) {
        process_xtab_drop(vCurrentE, _currentProdDrag, vCurrentThis);
    } else {
        if(ui.draggable.hasClass("tb-predefined")) {
            clear_xtab_grid();
            switch(ui.draggable.attr("data-predefined-type")) {
                case "frequency":
                    set_textify_toolbar();
                    break;
                case "nestedxtab":
                    set_nestedxtab_toolbar();
                    break;
            }
            process_xtab_drop(vCurrentE, _currentProdDrag, vCurrentThis);
        } else {
            var thisFrom = ui.draggable.parents(".k-treeview").attr("id").split("-")[1];
            switch(thisFrom) {
                case "dates":
                    windowDateDrop.center().open();
                    break;
                case "products":
                    process_xtab_drop(vCurrentE, _currentProdDrag, vCurrentThis);
//                    windowProdDrop.center().open();
                    break;
                default:
                    process_xtab_drop(vCurrentE, _currentProdDrag, vCurrentThis);
                    break;
            }
        }
    }
    resize_xtab_grid();
}

// =========================================================
// Reset XTAB after each selection
// =========================================================
var reset_droppable = function(droppable) {
    var cellID = null;
    if(droppable.hasClass("tb-cell-a")) {
        cellID = "tb-cell-a";
    } else if(droppable.hasClass("tb-cell-b")) {
        cellID = "tb-cell-b";
        $("#grid-deepdive").data("kendoGrid").thead.html("<th class='k-header noborder-left'></th><th class='k-header noborder-left'>base</th><th class='k-header'>&nbsp;</th>");
    } else if(droppable.hasClass("tb-cell-c")) {
        cellID = "tb-cell-c";
        $("#grid-deepdive").data("kendoGrid").dataSource.data([]);
    }
    $("#grid-deepdive ." + cellID).html($($("#toolbar-xtab").html()).filter("div.k-grid-header").find(">table td." + cellID).html()).attr({
        "data-axis-source": ""
    ,   "data-ids": ""
    ,   "data-child-ids": ""
    });
}

// =========================================================
// Reset Droppables using same source as Draggable
// =========================================================
var reset_axis_source = function(_AXIS_SOURCE, _AXIS_IDS) {
    var cellID = null;
    if($(".tb-droppable-cell[data-axis-source=" + _AXIS_SOURCE + "]").hasClass("tb-cell-a")) {
        cellID = "tb-cell-a";
    } else if($(".tb-droppable-cell[data-axis-source=" + _AXIS_SOURCE + "]").hasClass("tb-cell-b")) {
        cellID = "tb-cell-b";
    } else if($(".tb-droppable-cell[data-axis-source=" + _AXIS_SOURCE + "]").hasClass("tb-cell-c")) {
        cellID = "tb-cell-c";
    }

    if( (_AXIS_SOURCE != 'filters')  ||
        ($(".tb-droppable-cell[data-axis-source=" + _AXIS_SOURCE + "]").html($($("#toolbar-xtab").html()).filter("div.k-grid-header").find(">table td." + cellID).html()).attr('data-ids') == _AXIS_IDS)) {

      $(".tb-droppable-cell[data-axis-source=" + _AXIS_SOURCE + "]").html($($("#toolbar-xtab").html()).filter("div.k-grid-header").find(">table td." + cellID).html()).attr({
          "data-axis-source": ""
      ,   "data-ids": ""
      ,   "data-child-ids": ""
      });
    }
}

// =========================================================
// Update XTAB after each selection
// * WHAT ARE e, ui, _this
// * SUMMARY
// * SHORTEN LINE LENGTHS
// * MORE EMBEDDED NOTES IN CRITICAL SEGMENTS
// =========================================================
var process_xtab_drop = function(e, ui, _this) {
    var _PARENT_GRID = $(_this).parent()
    ,   _PARENTS_GRID = $(_this).parents(".k-grid:first")
    ,   allDateIds = [];
    if(_PARENT_GRID.attr("id") == "grid-listview") {
        $(".k-grid:visible").attr({
            "data-action": "list"
        }).addClass("tb-list").removeClass("tb-textify tb-xtab");
        if(treeDATES.getCheckedItems().length == 0) {
            treeDATES.element.find("li.k-item:first > div > span > input").prop({
                checked: "checked"
            }).trigger("change");
            _PARENT_GRID.find(".tb-cell-a").attr({
                "data-axis": "rows"
            ,   "data-axis-source": "dates"
            ,   "data-ids": ($("#grid-listview").is(":visible")) ? _PARENT_GRID.find("select.select-date-period").data("kendoDropDownList").value() : parseInt($("input[name=date-grouping]:checked").val())
            ,   "data-child-ids": allDateIds.join()
            });
        }
    } else {
        $(".k-grid:visible").attr({
            "data-action": "xtab"
        }).addClass("tb-xtab").removeClass("tb-textify tb-list");
        var dSource = build_dates_dropdown_source();
        for(var i = 0 ; i < dSource.length ; i++) {
            allDateIds.push(dSource[i].value);
        }
    }

    var _AXIS = null
    ,   _AXIS_SOURCE = null
    ,   _AXIS_IDS = []
    ,   _AXIS_CHILD_IDS = [];
    close_active_window();

    uberMenu.wrapper.find(">li:eq(0), >li:eq(2)").slideDown(250);
    if(ui.draggable.hasClass("tb-predefined")) {
        // -------------------------------------
        // NOTATE THIS
        // -------------------------------------
        switch(ui.draggable.attr("data-predefined-type")) {
            case "frequency":
                $(".k-grid:visible").attr("data-action", "text").addClass("tb-textify").removeClass("tb-xtab");
                uberMenu.wrapper.find(">li:eq(0), >li:eq(2)").slideUp(250);
                uberMenu.collapse("li").expand("li[data-from=Products]");
                uberMenu.select($("li[data-from=Products]"));
                treePRODUCTS.expand(treePRODUCTS.element.find(".treeview-product:first").parents("li.k-item"));
                treePRODUCTS.element.find(".treeview-product:first").parent().click().trigger("click");

                vPIVOT_DATA_SOURCE = [];
                reset_axis_source("dates");
                reset_axis_source("products");
                reset_axis_source("frequency");

                $(".k-grid:visible .3").addClass("k-header").attr({
                    "data-axis": "pivot"
                ,   "data-axis-source": _currentProdDrag.helper.find(".pivot").attr("data-pivot")
                ,   "data-ids": _currentProdDrag.helper.find(".pivot").attr("data-pivot-ids")
                ,   "data-child-ids": _currentProdDrag.helper.find(".pivot").attr("data-pivot-child-ids")
                });
                $(".k-grid:visible .tb-cell-b").attr({
                    "data-axis": "columns"
                ,   "data-axis-source": _currentProdDrag.helper.find(".columns").attr("data-columns")
                ,   "data-ids": _currentProdDrag.helper.find(".columns").attr("data-columns-ids")
                ,   "data-child-ids": _currentProdDrag.helper.find(".columns").attr("data-columns-child-ids")
                });
                $(".k-grid:visible .tb-cell-c").addClass("k-header").attr({
                    "data-axis": "rows"
                ,   "data-axis-source": _currentProdDrag.helper.find(".rows").attr("data-rows")
                ,   "data-ids": _currentProdDrag.helper.find(".rows").attr("data-rows-ids")
                ,   "data-child-ids": _currentProdDrag.helper.find(".rows").attr("data-rows-child-ids")
                });
                break;
            case "nestedxtab":
                $(".k-grid:visible").attr("data-action", "nestedxtab").addClass("tb-nestedxtab").removeClass("tb-xtab tb-textify");
                uberMenu.wrapper.find(">li:eq(0), >li:eq(1)").slideUp(250);
                $(".k-grid:visible .tb-cell-a").addClass("k-header").attr({
                    "data-axis": "pivot"
                ,   "data-axis-source": "products"
                ,   "data-ids": 3
                });
                $(".k-grid:visible .tb-cell-b").attr({
                    "data-axis": "columns"
                ,   "data-axis-source": "dates|metrics"
                ,   "data-ids": "2|"
                });
                $(".k-grid:visible .tb-cell-c").addClass("k-header").attr({
                    "data-axis": "rows"
                ,   "data-axis-source": "metrics"
                ,   "data-ids": ""
                ,   "data-child-ids": ""
                });
                break;
            case "xtab":
                $(".k-grid:visible").attr("data-action", "xtab").addClass("tb-xtab").removeClass("tb-textify");
                uberMenu.wrapper.find(">li:eq(0), >li:eq(1), >li:eq(2)").slideUp(250);
                uberMenu.collapse("li").expand("li[data-from=Products]");
                uberMenu.select($("li[data-from=Products]"));
                treePRODUCTS.expand(treePRODUCTS.element.find(".treeview-product:first").parents("li.k-item"));
                treePRODUCTS.element.find(".treeview-product:first").parent().click().trigger("click");
                break;
        }
    } else {
        $(".k-grid:visible").attr({
            "data-action": "xtab"
        });
        // -------------------------------------
        // WHICH AXIS IS BEING DROPPED?
        // -------------------------------------
        if($(_this).hasClass("tb-cell-a")) {
            _AXIS = "pivot";
        } else if($(_this).hasClass("tb-cell-b")) {
            _AXIS = "columns";
        } else if($(_this).hasClass("tb-cell-c")) {
            _AXIS = "rows";
        }

        // -------------------------------------
        // GET AXIS DATA
        // -------------------------------------
        if(ui.draggable.hasClass("draggable-daterange")) {
            // -------------------------------------
            // DATE RANGE
            // -------------------------------------
            _AXIS_SOURCE = "dates"
        ,   _AXIS_IDS = 0
        ,   _AXIS_CHILD_IDS = [];
            if($("input[name='overwriteDates[]']:eq(1)").is(":checked")) {
                if($(".k-grid:visible [data-axis-source=dates]").length > 0) {
                    var arrDates = $(".k-grid:visible [data-axis-source=dates]").attr("data-child-ids").split(",");
                    for(var i = 0 ; i < arrDates.length ; i++) {
                        _AXIS_CHILD_IDS.push(arrDates[i]);
                    }
                }
            } else {
                reset_droppable($(".tb-droppable-cell[data-axis-source=dates]"));
            }
            _AXIS_CHILD_IDS.push(get_selected_dates().join("|"));
        } else {
            _AXIS_SOURCE = ui.draggable.parents(".k-treeview").attr("id").split("-")[1];

            // -------------------------------------
            // Check if overwriting selections
            // -------------------------------------
            selCategories = [], selSubcategories = [], selProducts = [];
            if($(".k-grid:visible [data-axis-source=products]").length > 0) {
                if($("input[name='overwriteProducts[]']:eq(1)").is(":checked")) {
                    selProducts = $(".k-grid:visible [data-axis-source=products]").attr("data-child-ids").split(",").map(Number);
                }
            }
            if(_AXIS_SOURCE == "metrics") {
                if($(".k-grid:visible [data-axis-source=metrics]").length > 0) {
                    if($("input[name='overwriteMetrics[]']:eq(1)").is(":checked")) {
                        var arrMetrics = $(".k-grid:visible [data-axis-source=metrics]").attr("data-child-ids").split(",").map(Number);
                        for(var i = 0 ; i < arrMetrics.length ; i++) {
                            _AXIS_CHILD_IDS.push(arrMetrics[i]);
                        }
                    }
                }
            }
            if(_PARENT_GRID.attr("id") == "grid-deepdive") {
                reset_droppable(_PARENT_GRID.find(".tb-droppable-cell[data-axis-source=" + _AXIS_SOURCE + "]"));
            }
            switch(_AXIS_SOURCE) {
                // -------------------------------------
                // DATES
                // -------------------------------------
                case "dates":
                    var _arrDateTypes = ["year", "quarter", "month"];
                    _AXIS_IDS = parseInt($(":radio[name=date-grouping]:checked").val());
                    if(_AXIS_IDS == parseInt($("td[data-axis-source=dates]").attr("data-ids"))) {
                        _AXIS_CHILD_IDS = get_selected_dates();
                    } else {
                        _AXIS_CHILD_IDS = [];
                    }
                    if(ui.draggable.find("> ul").length == 0) {
                        if($.inArray(ui.draggable.find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id"), _AXIS_CHILD_IDS) == -1) {
                            _AXIS_CHILD_IDS.push(ui.draggable.find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id"));
                        }
                    } else {
                        ui.draggable.find("li.k-item").each(function() {
                            if(typeof $(this).find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id") !== "undefined") {
                                if($.inArray($(this).find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id"), _AXIS_CHILD_IDS) == -1 && _AXIS_CHILD_IDS.indexOf($(this).find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id")) == -1 && $(this).find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id") !== "undefined") {
                                    _AXIS_CHILD_IDS.push($(this).find("input").data(_arrDateTypes[_AXIS_IDS - 1] + "-id"));
                                }
                            }
                        });
                    }
                    break;
                // -------------------------------------
                // PRODUCTS
                // -------------------------------------
                case "products":
                    if(ui.draggable.find("> ul").length == 0) {
                        if($.inArray(ui.draggable.find("> div > span > span").data("product_id"), selProducts) == -1) {
                            selProducts.push(ui.draggable.find("> div > span > span").data("product_id"));
                        }
                    } else {
                        ui.draggable.find("li.k-item").each(function() {
                            if(typeof $(this).find("> div > span > span").data("cat_id") !== "undefined") {
                                if($.inArray($(this).find("> div > span > span").data("cat_id"), selCategories) == -1 && $(this).find("> div > span > span").data("cat_id") !== "undefined") {
                                    selCategories.push($(this).find("> div > span > span").data("cat_id"));
                                }
                            }
                            if(typeof $(this).find("> div > span > span").data("subcat_id") !== "undefined") {
                                if($.inArray($(this).find("> div > span > span").data("subcat_id"), selSubcategories) == -1 && $(this).find("> div > span > span").data("subcat_id") !== "undefined") {
                                    selSubcategories.push($(this).find("> div > span > span").data("subcat_id"));
                                }
                            }
                            if(typeof $(this).find("> div > span > span").data("product_id") !== "undefined") {
                                if($.inArray($(this).find("> div > span > span").data("product_id"), selProducts) == -1 && $(this).find("> div > span > span").data("product_id") !== "undefined") {
                                    selProducts.push($(this).find("> div > span > span").data("product_id"));
                                }
                            }
                        });
                    }
                    var _arrProdHier = [selCategories, selSubcategories, selProducts];
                    _AXIS_IDS = parseInt($(":radio[name=product-grouping]:checked").val())
                ,   _AXIS_CHILD_IDS = _arrProdHier[_AXIS_IDS - 1];
                    break;
                // -------------------------------------
                // METRICS
                // -------------------------------------
                case "metrics":
                    if(ui.draggable.find("> ul").length == 0) {
                        _AXIS_CHILD_IDS.push(ui.draggable.find("> div > span > span").data("metric_id"));
                    } else {
                        ui.draggable.find("li.k-item").each(function() {
                            if(typeof $(this).find("> div > span > span").data("metric_id") !== "undefined") {
                                _AXIS_CHILD_IDS.push($(this).find("> div > span > span").data("metric_id"));
                            }
                        });
                    }
                    break;
                // -------------------------------------
                // FILTERS
                // -------------------------------------
                case "filters":
                    if(ui.draggable.find("> ul").length == 0) {
                        _AXIS_IDS = ui.draggable.parent().parent(".k-item").data("fromeq");
                        _AXIS_CHILD_IDS.push(parseInt(ui.draggable.find("input").val()));
                    } else {
                        _AXIS_IDS = ui.draggable.data("fromeq");
                        if(ui.draggable.find("li.k-item input:checked").length == 0) {
                            ui.draggable.find("> ul > li.k-item").each(function() {
                                _AXIS_CHILD_IDS.push(parseInt($(this).find("> div > span > input").val()));
                            });
                        } else {
                            ui.draggable.find("input:checked").each(function() {
                                _AXIS_CHILD_IDS.push(parseInt($(this).val()));
                            });
                        }
                    }
                    break;
            }
        }
        reset_axis_source(_AXIS_SOURCE, _AXIS_IDS);

        // -------------------------------------
        // SELECTION FEEDBACK
        // -------------------------------------
        $(_this).attr({
            "data-axis": _AXIS
        ,   "data-axis-source": _AXIS_SOURCE
        ,   "data-ids": _AXIS_IDS
        ,   "data-child-ids": $.isArray(_AXIS_CHILD_IDS) && _AXIS == "pivot" ? _AXIS_CHILD_IDS[0] : _AXIS_CHILD_IDS
        });

        switch(_AXIS) {
            // =====================================
            // PIVOT
            // =====================================
            case "pivot":
                vPIVOT_DROP_HEADER = ""
            ,   vPIVOT_DATA_SOURCE = [];
                switch(_AXIS_SOURCE) {
                    // -------------------------------------
                    // DATES
                    // -------------------------------------
                    case "dates":
                        if(_AXIS_IDS == 0) {
                            vPIVOT_DROP_HEADER = "Range";
                            vPIVOT_DATA_SOURCE.push({
                                value: _AXIS_CHILD_IDS.join("")
/* CHANGE THIS FEEDBACK TO LOOP THROUGH DATE HIERARCHY */
                            ,   text: $("#date-from").val() + " thru " + $("#date-to").val()
                            });
                            _AXIS_CHILD_IDS = get_selected_dates();
                            $(_this).attr({
                                "data-child-ids": _AXIS_CHILD_IDS.join("-")
                            });
                        } else {
                            ui.draggable.find(".k-item").each(function(i) {
                                _EXIST = false;
                                switch(_AXIS_IDS) {
                                    case 1:
                                        vPIVOT_DROP_HEADER = "Year";
                                        for(i = 0 ; i < vPIVOT_DATA_SOURCE.length ; i++) {
                                            if(vPIVOT_DATA_SOURCE[i].value == $(this).find("> div > span > input").data("year-id")) {
                                                _EXIST = true;
                                            }
                                        }
                                        if(_EXIST == false) {
                                            thisText = ui.draggable.find("> div > span.k-in").text();
                                            if(ui.draggable.find("> div > span > input").data("year-id") == 0) {
                                                thisText = ui.draggable.find("> ul > li > div > span.k-in:eq(" + i + ")").text();
                                            }
                                            vPIVOT_DATA_SOURCE.push({
                                                value: $(this).find("> div > span > input").data("year-id")
                                            ,   text: thisText
                                            });
                                        }
                                        break;
                                    case 2:
                                        vPIVOT_DROP_HEADER = "Quarter";
                                        for(i = 0 ; i < vPIVOT_DATA_SOURCE.length ; i++) {
                                            if(vPIVOT_DATA_SOURCE[i].value == $(this).find("> div > span > input").data("quarter-id")) {
                                                _EXIST = true;
                                            }
                                        }
                                        if(_EXIST == false) {
                                            vPIVOT_DATA_SOURCE.push({
                                                value: $(this).find("> div > span > input").data("quarter-id")
                                            ,   text: $(this).parents("li.k-item").not(":last").eq(-2).find("> div > span:last").text() + " " + $(this).find("> div > span > input").parent().next().text()
                                            });
                                        }
                                        break;
                                    case 3:
                                        vPIVOT_DROP_HEADER = "Month";
                                        for(i = 0 ; i < vPIVOT_DATA_SOURCE.length ; i++) {
                                            if(vPIVOT_DATA_SOURCE[i].value == $(this).find("> div > span > input").data("month-id")) {
                                                _EXIST = true;
                                            }
                                        }
                                        if(_EXIST == false) {
                                            if($(this).find("> div > span > input").data("month-id") !== "undefined") {
                                                vPIVOT_DATA_SOURCE.push({
                                                    value: $(this).find("> div > span > input").data("month-id")
                                                ,   text: $(this).parents("li.k-item").not(":last").eq(-2).find("> div > span:last").text() + " " + $(this).find("> div > span > input").parent().next().text()
                                                });
                                            }
                                        }
                                        break;
                                }
                            });
                        }
                        break;
                    // -------------------------------------
                    // PRODUCTS
                    // -------------------------------------
                    case "products":
                        switch(_AXIS_IDS) {
                            case 1:
                                for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                    vPIVOT_DATA_SOURCE.push({
                                        value: _AXIS_CHILD_IDS[i]
                                    ,   text: $.trim($("#menu-side span[data-cat_id=" + _AXIS_CHILD_IDS[i] + "]:first").clone().children().remove().end().text().replace(/\(\)/g, "")) + '</td>'
                                    });
                                }
                                break;
                            case 2:
                                break;
                            case 3:
                                for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                    vPIVOT_DATA_SOURCE.push({
                                        value: _AXIS_CHILD_IDS[i]
                                    ,   text: $("#menu-side span[data-product_id=" + _AXIS_CHILD_IDS[i] + "]").text()
                                    });
                                }
                                break;
                        }
                        break;
                    // -------------------------------------
                    // METRICS
                    // -------------------------------------
                    case "metrics":
                        vPIVOT_DROP_HEADER = ui.draggable.find("> div > span:last > span").text();
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            vPIVOT_DATA_SOURCE.push({
                                value: _AXIS_CHILD_IDS[i]
                            ,   text: $("span[data-metric_id=" + _AXIS_CHILD_IDS[i] + "]:first").text()
                            });
                        }
                        break;
                    // -------------------------------------
                    // FILTERS
                    // -------------------------------------
                    case "filters":
                        vPIVOT_DROP_HEADER = ui.draggable.find("> div > span:last > span").text();
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            vPIVOT_DATA_SOURCE.push({
                                value: _AXIS_CHILD_IDS[i]
                            ,   text: $("input[data-filter-id=" + _AXIS_IDS + "]:first").parent().parent().next().find("li.k-item:eq(" + i + ") .treeview-filter").text()
                            });
                        }
                        break;
                }
                rebuild_cella_dropdown();
                break;
            // =====================================
            // COLUMNS
            // =====================================
            case "columns":
                set_xtab_columns(_AXIS_SOURCE, _AXIS_IDS, _AXIS_CHILD_IDS, ui);
                break;
            // =====================================
            // ROWS
            // =====================================
            case "rows":
                var _ROWS_DATA_SOURCE = [];
                switch(_AXIS_SOURCE) {
                    // -------------------------------------
                    // DATES
                    // -------------------------------------
                    case "dates":
                        var gridDeepDive = $("#grid-deepdive").data("kendoGrid").wrapper
                        ,   dateRangeYears = []
                        ,   dateRangeQuarters = []
                        ,   dateRangeMonths = [];
                        DATES.data()[0].items.forEach(function(h) {
                            dateRangeYears.push({id: h.year_id, text: h.text});
                            h.items.forEach(function(j) {
                                dateRangeQuarters.push({id: j.quarter_id, text: j.year + " " + j.text.replace("uarter ", "")});
                                j.items.forEach(function(k) {
                                    dateRangeMonths.push({id: k.month_id, text: k.year + " " + k.text.substr(0, 3)});
                                });
                            });
                        });

                        if(ui.draggable.hasClass("draggable-daterange")) {
                            _ROWS_DATA_SOURCE.push({
                                id: get_selected_dates().join(".")
                            ,   item: $("#date-from").val() + " thru " + $("#date-to").val()
                            });
                        } else {
                            switch(ui.draggable.parents("li.k-item").length) {
                                case 1:// All
                                    for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                        if(_AXIS_IDS == 1) {
                                            _ROWS_DATA_SOURCE.push({
                                                id: _AXIS_CHILD_IDS[i]
                                            ,   item: "Year " + ui.draggable.find("input[data-year-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text()
                                            });
                                        } else if(_AXIS_IDS == 2) {
                                            if(ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() !== "All") {
                                                _ROWS_DATA_SOURCE.push({
                                                    id: _AXIS_CHILD_IDS[i]
                                                ,   item: $("input[data-year-id=" + ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text()
                                                });
                                            }
                                        } else if(_AXIS_IDS == 3) {
                                            _ROWS_DATA_SOURCE.push({
                                                id: _AXIS_CHILD_IDS[i]
                                            ,   item: $("input[data-year-id=" + ui.draggable.find("input[data-month-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find("input[data-month-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text()
                                            });
                                        }
                                    }
                                    break;
                                case 2:// Year
                                    for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                        if(_AXIS_IDS == 1) {
                                            _ROWS_DATA_SOURCE.push({
                                                id: _AXIS_CHILD_IDS[i]
                                            ,   item: getObjects(dateRangeYears, "id", _AXIS_CHILD_IDS[i])[0].text
                                            });
                                        } else if(_AXIS_IDS == 2) {
                                            _ROWS_DATA_SOURCE.push({
                                                id: _AXIS_CHILD_IDS[i]
                                            ,   item: getObjects(dateRangeQuarters, "id", _AXIS_CHILD_IDS[i])[0].text
                                            });
                                        } else if(_AXIS_IDS == 3) {
                                            _ROWS_DATA_SOURCE.push({
                                                id: _AXIS_CHILD_IDS[i]
                                            ,   item: getObjects(dateRangeMonths, "id", _AXIS_CHILD_IDS[i])[0].text
                                            });
                                        }
                                    }
                                    break;
                                case 3:// Quarter
                                    for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                        _ROWS_DATA_SOURCE.push({
                                            id: _AXIS_CHILD_IDS[i]
                                        ,   item: getObjects(dateRangeQuarters, "id", _AXIS_CHILD_IDS[i])[0].text
                                        });
                                    }
                                    break;
                                case 4:// Month
                                    for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
//                                        if(_AXIS_IDS == 1) {
//                                            _ROWS_DATA_SOURCE.push({
//                                                id: _AXIS_CHILD_IDS[i]
//                                            ,   item: getObjects(dateRangeYears, "id", _AXIS_CHILD_IDS[i])[0].text
//                                            });
//                                        } else if(_AXIS_IDS == 2) {
//                                            _ROWS_DATA_SOURCE.push({
//                                                id: _AXIS_CHILD_IDS[i]
//                                            ,   item: getObjects(dateRangeQuarters, "id", _AXIS_CHILD_IDS[i])[0].text
//                                            });
//                                        } else if(_AXIS_IDS == 3) {
                                            _ROWS_DATA_SOURCE.push({
                                                id: _AXIS_CHILD_IDS[i]
                                            ,   item: getObjects(dateRangeMonths, "id", _AXIS_CHILD_IDS[i])[0].text
                                            });
//                                        }
                                    }
                                    break;
                            }
                            break;
                        }
                    // -------------------------------------
                    // PRODUCTS
                    // -------------------------------------
                    case "products":
                        switch(_AXIS_IDS) {
                            case 1:
                                for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                    _ROWS_DATA_SOURCE.push({
                                        id: _AXIS_CHILD_IDS[i]
                                    ,   item: $.trim($("#menu-side span[data-cat_id=" + _AXIS_CHILD_IDS[i] + "]:first").clone().children().remove().end().text().replace(/\(\)/g, ""))
                                    });
                                }
                                break;
                            case 2:
                                break;
                            case 3:
                                for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                                    _ROWS_DATA_SOURCE.push({
                                        id: _AXIS_CHILD_IDS[i]
                                    ,   item: $("#menu-side span[data-product_id=" + _AXIS_CHILD_IDS[i] + "]:last").text()
                                    });
                                }
                                break;
                        }
                        break;
                    // -------------------------------------
                    // METRICS
                    // -------------------------------------
                    case "metrics":
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            var _HEADER = ui.draggable.find("> div > span:last > span").text() + ": ";
                            if(_HEADER == "Key Metrics: ") {
                                _HEADER = "";
                            }
                            _ROWS_DATA_SOURCE.push({
                                id: _AXIS_CHILD_IDS[i]
                            ,   item: _HEADER + $("span[data-metric_id=" + _AXIS_CHILD_IDS[i] + "]:first").text()
                            });
                        }
                        break;
                    // -------------------------------------
                    // FILTERS
                    // -------------------------------------
                    case "filters":
                        switch(ui.draggable.parents("li.k-item").length) {
                            case 1:
                                ui.draggable.find("> ul > li.k-item").each(function() {
                                    _ROWS_DATA_SOURCE.push({
                                        id: $(this).find("> div > span > input").val()
                                    ,   item: $("> div > span > span", ui.draggable).text() + " " + $(this).find("> div > span > span").text()
                                    });
                                });
                                break;
                            default:
                                _ROWS_DATA_SOURCE.push({
                                    id: ui.draggable.find("> div > span > input").val()
                                ,   item: ui.draggable.parents("li.k-item:first").find("> div > span:last > span").text() + " " + ui.draggable.find("> div > span > span").text()
                                });
                                break;
                        }
                        break;
                }
                var _ROWS_DATA_SOURCE = new kendo.data.DataSource({
                    data: _ROWS_DATA_SOURCE
                });
                if(_PARENT_GRID.parents("#grid-deepdive").length > 0) {
                    _PARENT_GRID = _PARENT_GRID.parents("#grid-deepdive");
                }
                rebuild_xtab_grid(_PARENT_GRID, _ROWS_DATA_SOURCE, vDefaultCols);
                break;
        }
        load_xtab_data();
    }
}

// =========================================================
// Update XTAB columns
// =========================================================
var set_xtab_columns = function(_AXIS_SOURCE, _AXIS_IDS, _AXIS_CHILD_IDS, ui) {
    var _COLUMN_HTML = "<th></th><th>base</th>";
    switch(_AXIS_SOURCE) {
        // -------------------------------------
        // DATE
        // -------------------------------------
        case "dates":
            if(ui.draggable.hasClass("draggable-daterange")) {
                _COLUMN_HTML += '<th class="k-header">' + $("#date-from").val() + " thru " + $("#date-to").val() + '</th>';
            } else {
                switch(ui.draggable.parents("li.k-item").length) {
                    case 1:// All
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            if(_AXIS_IDS == 1) {
                                _COLUMN_HTML += '<th class="k-header">Year ' + ui.draggable.find("input[data-year-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 2) {
                                if(ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() !== "All") {
                                    _COLUMN_HTML += '<th class="k-header">' + $("input[data-year-id=" + ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() + '</th>';
                                }
                            } else if(_AXIS_IDS == 3) {
                                _COLUMN_HTML += '<th class="k-header">' + $("input[data-year-id=" + ui.draggable.find("input[data-month-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find("input[data-month-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() + '</th>';
                            }
                        }
                        break;
                    case 2:// Year
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            if(_AXIS_IDS == 1) {
                                _COLUMN_HTML += '<th class="k-header">Year ' + ui.draggable.find("input[data-year-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 2) {
                                _COLUMN_HTML += '<th class="k-header">' + ui.draggable.find("> div > span:last").text() + " " + ui.draggable.find('input[data-quarter-id="' + _AXIS_CHILD_IDS[i] + '"]:first').parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 3) {
                                _COLUMN_HTML += '<th class="k-header">' + ui.draggable.find("> div > span:last").text() + " " + ui.draggable.find('input[data-month-id="' + _AXIS_CHILD_IDS[i] + '"]:first').parent().next().text() + '</th>';
                            }
                        }
                        break;
                    case 3:// Quarter
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            if(_AXIS_IDS == 1) {
                                _COLUMN_HTML += '<th class="k-header">Year ' + ui.draggable.find("input[data-year-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 2) {
                                _COLUMN_HTML += '<th class="k-header">' + $("input[data-year-id=" + ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find('input[data-quarter-id="' + _AXIS_CHILD_IDS[i] + '"]:first').parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 3) {
                                _COLUMN_HTML += '<th class="k-header">' + $("input[data-year-id=" + ui.draggable.find("input[data-month-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find('input[data-month-id="' + _AXIS_CHILD_IDS[i] + '"]:first').parent().next().text() + '</th>';
                            }
                        }
                        break;
                    case 4:// Month
                        for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                            if(_AXIS_IDS == 1) {
                                _COLUMN_HTML += '<th class="k-header">Year ' + ui.draggable.find("input[data-year-id=" + _AXIS_CHILD_IDS[i] + "]:first").parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 2) {
                                _COLUMN_HTML += '<th class="k-header">' + $("input[data-year-id=" + ui.draggable.find("input[data-quarter-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find('input[data-quarter-id="' + _AXIS_CHILD_IDS[i] + '"]:first').parent().next().text() + '</th>';
                            } else if(_AXIS_IDS == 3) {
                                _COLUMN_HTML += '<th class="k-header">' + $("input[data-year-id=" + ui.draggable.find("input[data-month-id=" + _AXIS_CHILD_IDS[i] + "]:first").data("year-id") + "]:first").parent().next().text() + " " + ui.draggable.find('input[data-month-id="' + _AXIS_CHILD_IDS[i] + '"]:first').parent().next().text() + '</th>';
                            }
                        }
                        break;
                }
            }
            break;
        // -------------------------------------
        // PRODUCTS
        // -------------------------------------
        case "products":
            switch(_AXIS_IDS) {
                case 1:
                    for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                        _COLUMN_HTML += '<th class="k-header">' + $.trim($("#menu-side span[data-cat_id=" + _AXIS_CHILD_IDS[i] + "]:first").clone().children().remove().end().text().replace(/\(\)/g, "")) + '</th>';
                    }
                    break;
                case 2:
                    break;
                case 3:
                    for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                        _COLUMN_HTML += '<th class="k-header">' + $("#menu-side span[data-product_id=" + _AXIS_CHILD_IDS[i] + "]:first").text() + '</th>';
                    }
                    break;
            }
            break;
        // -------------------------------------
        // METRICS
        // -------------------------------------
        case "metrics":
            if(ui.draggable.parents("li.k-item").length == 1) {
                ui.draggable.find("li.k-item").each(function() {
                    var _HEADER = "";
                    if(ui.draggable.find("> div > span > span").text() !== "Key Metrics") {
                        _HEADER = ui.draggable.find("> div > span > span").text() + " ";
                    }
                    _COLUMN_HTML += '<th class="k-header cursor-pointer tb-removable" data-metric_id="' + $(this).find(".treeview-metric").attr("data-metric_id") + '">' + _HEADER + $(this).find("> div > span > span").text() + '</th>';
                });
            } else if(ui.draggable.parents("li.k-item").length > 1) {
                for(var i = 0 ; i < _AXIS_CHILD_IDS.length ; i++) {
                    var _HEADER = "";
                    if(ui.draggable.parents("li.k-item:first").find("> div > span > span").text() !== "Key Metrics") {
                        _HEADER = ui.draggable.parents("li.k-item:first").find("> div > span > span").text() + " "
                    ,   _TEXT = ui.draggable.find(">div>span>span").text();
                    } else {
                        _HEADER = $("#tree-metrics").find("[data-metric_id=" + _AXIS_CHILD_IDS[i] + "]").not(":first").parents("li.k-item").not(":last").eq(1).find(">div>span>span").text() + " "
                    ,   _TEXT = $("#tree-metrics").find("[data-metric_id=" + _AXIS_CHILD_IDS[i] + "]").not(":first").text();
                    }
                    _COLUMN_HTML += '<th class="k-header cursor-pointer tb-removable" data-metric_id="' + _AXIS_CHILD_IDS[i] + '">' + _HEADER + _TEXT + '</th>';
                }
            }
//            $("#grid-deepdive thead tr th:gt(1)").unbind().bind("click", function(e) {
//                var removeMetric = $(this).attr("data-metric_id");
//                var currMetrics = $(".k-grid:visible .tb-cell-b").attr("data-child-ids").split(",").map(Number);
//                for(var i = 0 ; i < currMetrics.length ; i++) {
//                    if(currMetrics[i] == removeMetric) {
//                        $(this).fadeOut().remove();
//                        currMetrics.splice(i, 1);
//                        break;
//                    }
//                }
//                $(".k-grid:visible .tb-cell-b").attr({"data-child-ids": currMetrics.join()});
//            });
            break;
        // -------------------------------------
        // FILTERS
        // -------------------------------------
        case "filters":
            switch(ui.draggable.parents("li.k-item").length) {
                case 1:
                    ui.draggable.find("> ul > li.k-item").each(function() {
                        _COLUMN_HTML += '<th class="k-header">' + $("> div > span > span", ui.draggable).text() + " " + $(this).find("> div > span > span").text() + '</th>';
                    });
                    break;
                default:
                    _COLUMN_HTML += '<th class="k-header">' + ui.draggable.parents("li.k-item:first").find("> div > span:last > span").text() + " " + ui.draggable.find("> div > span > span").text() + '</th>';
                    break;
            }
            break;
    }
    $("#grid-deepdive thead tr").html(_COLUMN_HTML);
    var _dataSource = []
    ,   _gridDeepDive = $("#grid-deepdive").data("kendoGrid");
    if(_gridDeepDive.dataSource.data().length > 0) {
        _dataSource = _gridDeepDive.dataSource.data();
    }
    rebuild_xtab_grid($("#grid-deepdive"), _dataSource, vDefaultCols);
    resize_xtab_grid();
}

// =========================================================
// GET XTAB DATA
// =========================================================
var load_xtab_data = function() {
    var runOrNot = false
    ,   thisGrid = $(".k-grid:visible")
    ,   _LIST = $("#list-stopwords .stop-word")
    ,   _STOPWORDS = [];
    for(var i = 0 ; i < _LIST.length ; i++) {
        _STOPWORDS.push($(_LIST[i]).clone().children().remove().end().text().trim());
    }
    var ACTION = thisGrid.attr("data-action");
    var DATA_TYPE = "xtab";
    var PIVOT = thisGrid.find(".tb-cell-a").attr("data-axis-source");
    var PIVOT_IDS = thisGrid.find(".tb-cell-a").attr("data-ids");
    var PIVOT_CHILD_IDS = thisGrid.find(".tb-cell-a").attr("data-child-ids");
    if(typeof thisGrid.find(".tb-cell-a").find("div").data("kendoDropDownList") !== "undefined") {
        PIVOT_CHILD_IDS = thisGrid.find(".tb-cell-a").find("div").data("kendoDropDownList").value();
    }
    var COLUMNS = thisGrid.find(".tb-cell-b").attr("data-axis-source");
    var COLUMNS_IDS = thisGrid.find(".tb-cell-b").attr("data-ids");
    var COLUMNS_CHILD_IDS = thisGrid.find(".tb-cell-b").attr("data-child-ids");
    var ROWS = (thisGrid.attr("id") == "grid-listview") ? thisGrid.find(".tb-cell-c.k-grid-content").attr("data-axis-source") : thisGrid.find(".tb-cell-c").attr("data-axis-source");
    var ROWS_IDS = (thisGrid.attr("id") == "grid-listview") ? thisGrid.find(".tb-cell-c.k-grid-content").attr("data-ids") : (thisGrid.attr("data-action") == "text") ? thisGrid.find("select.select-cloudtype").data("kendoDropDownList").value() : thisGrid.find(".tb-cell-c").attr("data-ids");
    var ROWS_CHILD_IDS = (thisGrid.attr("id") == "grid-listview") ? thisGrid.find(".tb-cell-c.k-grid-content").attr("data-child-ids") : thisGrid.find(".tb-cell-c").attr("data-child-ids");
    var date_filter = get_date_filter();

    if( (ROWS == 'dates') && (ROWS_IDS == 0) ) {
        ROWS_CHILD_IDS = date_filter.dates;
    }

    if( (COLUMNS == 'dates') && (COLUMNS_IDS == 0) ) {
        COLUMNS_CHILD_IDS = date_filter.dates;
    }

    if(thisGrid.attr("data-action") == "text") {
        COLUMNS_IDS = 3;
        COLUMNS_CHILD_IDS = treePRODUCTS.element.find("#tree-products_tv_active .treeview-product").attr("data-product_id");
    }
    if(typeof thisGrid.find(".tb-cell-a").find("div").data("kendoDropDownList") !== "undefined") {
        PIVOT_CHILD_IDS = thisGrid.find(".tb-cell-a").find("div").data("kendoDropDownList").value();
    }
    if(ACTION == "text") {
        DATA_TYPE = "text";
    }

    var DATA = {
        DATA_TYPE: DATA_TYPE
    ,   PIVOT: PIVOT
    ,   PIVOT_IDS: PIVOT_IDS
    ,   PIVOT_CHILD_IDS: PIVOT_CHILD_IDS
    ,   COLUMNS: COLUMNS
    ,   COLUMNS_IDS: COLUMNS_IDS
    ,   COLUMNS_CHILD_IDS: COLUMNS_CHILD_IDS
    ,   ROWS: ROWS
    ,   ROWS_IDS: ROWS_IDS
    ,   ROWS_CHILD_IDS: ROWS_CHILD_IDS
    ,   FILTERS: get_selected_filters()
    ,   DATES: date_filter.dates
    ,   DATE_TYPE: ((date_filter.date_type == "range")?(4):(3))
    ,   STORES: get_selected_stores()
    ,   CONFIDENCE: get_confidence_level()
    ,   AVERAGE: ($(".k-grid:visible select.select-average").data("kendoDropDownList")) ? $(".k-grid:visible select.select-average").data("kendoDropDownList").value() : "0-0"
    ,   STOPWORDS: _STOPWORDS
    ,   wbrs_test: $.cookie("wbrs_test_token")
    };
    if(PIVOT_SELECTIONS !== DATA.PIVOT) {
        runOrNot = true;
    }
    if(PIVOT_IDS_SELECTIONS !== DATA.PIVOT_IDS) {
        runOrNot = true;
    }
    if(PIVOT_CHILD_IDS_SELECTIONS !== DATA.PIVOT_CHILD_IDS) {
        runOrNot = true;
    }
    if(COLUMNS_SELECTIONS !== DATA.COLUMNS) {
        runOrNot = true;
    }
    if(COLUMNS_IDS_SELECTIONS !== DATA.COLUMNS_IDS) {
        runOrNot = true;
    }
    if(COLUMNS_CHILD_IDS_SELECTIONS !== DATA.COLUMNS_CHILD_IDS) {
        runOrNot = true;
    }
    if(ROWS_SELECTIONS !== DATA.ROWS) {
        runOrNot = true;
    }
    if(ROWS_IDS_SELECTIONS !== DATA.ROWS_IDS) {
        runOrNot = true;
    }
    if(ROWS_CHILD_IDS_SELECTIONS !== DATA.ROWS_CHILD_IDS) {
        runOrNot = true;
    }
    if(DATE_SELECTIONS !== DATA.DATES) {
        runOrNot = true;
    }
    if(FILTER_SELECTIONS !== DATA.FILTERS) {
        runOrNot = true;
    }
    if(AVERAGE_SELECTIONS !== DATA.AVERAGE) {
        runOrNot = true;
    }
    if(STOPWORDS_SELECTIONS !== DATA.STOPWORDS.join()) {
        runOrNot = true;
    }
    PIVOT_SELECTIONS = DATA.PIVOT;
    PIVOT_IDS_SELECTIONS = DATA.PIVOT_IDS;
    PIVOT_CHILD_SELECTIONS = DATA.PIVOT_CHILD_IDS;
    COLUMNS_SELECTIONS = DATA.COLUMNS;
    COLUMNS_IDS_SELECTIONS = DATA.COLUMNS_IDS;
    COLUMNS_CHILD_IDS_SELECTIONS = DATA.COLUMNS_CHILD_IDS;
    ROWS_SELECTIONS = DATA.ROWS;
    ROWS_IDS_SELECTIONS = DATA.ROWS_IDS;
    ROWS_CHILD_IDS_SELECTIONS = DATA.ROWS_CHILD_IDS;
    DATE_SELECTIONS = DATA.DATES;
    FILTER_SELECTIONS = DATA.FILTERS;
    AVERAGE_SELECTIONS = DATA.AVERAGE;
    STOPWORDS_SELECTIONS = DATA.STOPWORDS.join();
    $('#no-data-message').remove();
    if(DATA.PIVOT !== "" && DATA.COLUMNS !== "" && (DATA.ROWS !== "" && typeof(DATA.ROWS) !== "undefined") && runOrNot || (DATA.AVERAGE !== "0-0" && DATA.PIVOT !== "" && DATA.COLUMNS !== "" && runOrNot)) {
        if(!vCheckActive) {
            kendo.ui.progress($("body"), 1);
            vCheckActive = $.ajax({
                dataType: "json"
            ,   url: siteBase + "index.php?/datajson/index"
            ,   type: "POST"
            ,   data: DATA
            ,   error: function() {
                    kendo.ui.progress($("body"), 0);
                    vCheckActive = false;
                }
            ,   success: function(result) {
                    var BOOL_FIRST_ROW_BASE = result.BOOL_FIRST_ROW_BASE
                    ,   BOOL_TEXT_ANALYTICS = result.BOOL_TEXT_ANALYTICS
                    ,   _GRID = $(".k-grid:visible").data("kendoGrid")
                    ,   _GRID_ELEMENT = _GRID.element
                    ,   _CELLA = _GRID_ELEMENT.find(".tb-cell-a").clone()
                    ,   _CELLB = _GRID_ELEMENT.find(".tb-cell-b").clone()
                    ,   _CELLC = _GRID_ELEMENT.find(".tb-cell-c:first").clone()
                    ,   _CELLCC = _GRID_ELEMENT.find(".tb-cell-c.k-grid-content").clone()
                    ,   _CLEAN_DATA = result.CLEAN_DATA
                    ,   _COLUMNS_LIST = result.COLUMNS_LIST
                    ,   _WORD_CLOUD_PNG = result.WORD_CLOUD_PNG;
                    if( _CLEAN_DATA.length ==0 ) {
                      kendo.ui.progress($("body"), 0);
                      $(_GRID_ELEMENT).find('div.k-grid-content').append( '<div id="no-data-message" style="position: absolute; top: 0px; left: 0px; height: 100%; background-color: white; z-index: 10; padding-left: 10px">' +
                        '<h1>No results found for the given selections and filters.</h1></div>');
                        vCheckActive = false;
                      return;
                    }
                    if(_CELLC.attr("data-axis-source") == "") {
                        _CELLC = _CELLCC;
                    }
                    if(_GRID_ELEMENT.attr("id") == "grid-listview") {
                        _GRID_ELEMENT.removeClass("k-grid k-widget").empty();
                        _GRID.destroy();
                        rebuild_xtab_grid(_GRID_ELEMENT, _CLEAN_DATA, COLS_LIST);
                        set_toolbar_buttons();
                        set_listview_droppables();
                        scorecard_links();
                        resize_list_grids();
                    } else {
                        _GRID_ELEMENT.removeClass("k-grid k-widget").empty();
                        _GRID.destroy();
                        rebuild_xtab_grid(_GRID_ELEMENT, _CLEAN_DATA, _COLUMNS_LIST);
                        set_xtab_toolbar();
                        set_nestedxtab_toolbar();
                        // --------------------------------
                        // RESET NESTED XTAB COLUMNS
                        // --------------------------------
                        var gridDeepDive = $("#grid-deepdive").data("kendoGrid")
                        ,   lastTh = ""
                        ,   noBorderCols = [];
                        gridDeepDive.thead.find("th:visible").each(function() {
                            var thisTitle = $(this).data("title")
                            ,   html = '';
                            if($(this).data("title").indexOf("|") > -1) {
                                thisTitle = thisTitle.split("|")[0];
                                if(lastTh !== thisTitle) {
                                    lastTh = thisTitle;
                                    gridDeepDive.thead.find("th:visible[data-title^='" + thisTitle + "']:eq(0)").attr("colspan", gridDeepDive.thead.find("th:visible[data-title^='" + thisTitle + "']").length).addClass("tabulous-split-column");
                                    html += '<td>' + $(this).data("title").split("|")[1] + '</td>';
                                    gridDeepDive.thead.find("th:visible[data-title^='" + thisTitle + "']:gt(0)").each(function() {
                                        noBorderCols.push($(this).index());
                                        html += '<td>' + $(this).data("title").split("|")[1] + '</td>';
                                    }).hide();
                                    gridDeepDive.thead.find("th:visible[data-title^='" + thisTitle + "']:eq(0)").html(thisTitle).append('<table class="tabulous-split-columns"><tbody><tr>' + html + '</tr></tbody></table>');
                                }
                            }
                        });
                        gridDeepDive.tbody.find("tr").each(function() {
                            var thisThis = this;
                            noBorderCols.forEach(function(h) {
                                $("td:eq(" + h + ")", thisThis).addClass("noborder-left");
                            });
                        });
                    }
                    if(!BOOL_TEXT_ANALYTICS) {
                        // --------------------------------
                        // A Highlight Base row
                        // B Re-stripe rows
                        // C Remove parity identifiers
                        // D Reformat Base row
                        // E Copy .stat-test HTML
                        // F Reformat Mean scores
                        // --------------------------------
                        if(BOOL_FIRST_ROW_BASE) {
                            $(".k-grid:visible").data("kendoGrid").content.find("tr:first").addClass("k-header");                                     // A
                            $(".k-grid:visible").data("kendoGrid").content.find("tr").removeClass("k-alt").parent().find("tr:even").addClass("k-alt");// B
                            _GRID_ELEMENT.find("span.identifier").remove();                                                                           // C
                            $(".k-grid:visible").data("kendoGrid").content.find("tbody > tr:first td.tb-score").each(function() {                     // D
                                $(this).html(numberWithCommas($.trim($(this).text().replace(",", "").replace("%", "")) / 100));
                            });
                            $(".k-grid:visible").data("kendoGrid").content.find("tbody > tr td.noborder-left").each(function() {
                                if($(this).clone().children().remove().end().text().substr(-4) == "Mean" || $(this).clone().children().remove().end().text().substr(-7) == "Std Dev") {
                                    $(this).parent().find("td.tb-score").each(function() {
                                        if($.trim($(this).text()) !== "") {
                                            var statTest = $(".stat-test", this);                                                        // E
                                            $(this).html((parseInt($(this).text().replace(/%/g, "")) / 100).toFixed(1)).append(statTest);// F
                                        }
                                    });
                                }
                            });
                        }
                        rebuild_cella_dropdown();
                        scorecard_links();
                        _GRID_ELEMENT.find(".tb-cell-a").attr({
                            "data-axis": "pivot"
                        ,   "data-axis-source": _CELLA.attr("data-axis-source")
                        ,   "data-ids": _CELLA.attr("data-ids")
                        ,   "data-child-ids": _CELLA.attr("data-child-ids")
                        });
                    } else {
                        if($("#tree-dates").data("kendoTreeView").getCheckedItems().length == 0) {
                            treeDATES.element.find("input[data-quarter-id!=undefined][data-month-id=undefined]").last().prop("checked", "checked");
                            $(".treeview-product:eq(0)").click();
                        }
                        vPIVOT_DATA_SOURCE = [];
                        mergeGridRows(_GRID_ELEMENT, "blankspace", 15);
                        $("td.tb-merged").html('<img class="tb-image-clickable" src="' + _WORD_CLOUD_PNG + '" width="100%"/>').find("img").unbind().bind("click", function() {
                            $(windowWordCloud.element).find(".wordcloud-image img").attr({
                                "src": 'url("/common/kendo/2014.1.409/styles/Uniform/loading-image.gif")'
                            });
                            windowWordCloud.center().open();
                            windowWordCloud.element.find(".wordcloud-image img").attr({
                                "src": _WORD_CLOUD_PNG
                            });
                        });
                        set_textify_toolbar();
                    }
                    _GRID_ELEMENT.find(".tb-cell-b").attr({
                        "data-axis": "columns"
                    ,   "data-axis-source": _CELLB.attr("data-axis-source")
                    ,   "data-ids": _CELLB.attr("data-ids")
                    ,   "data-child-ids": _CELLB.attr("data-child-ids")
                    });
                    _GRID_ELEMENT.find(".tb-cell-c").attr({
                        "data-axis": "columns"
                    ,   "data-axis-source": _CELLC.attr("data-axis-source")
                    ,   "data-ids": _CELLC.attr("data-ids")
                    ,   "data-child-ids": _CELLC.attr("data-child-ids")
                    });
                    vCheckActive = false;
                    kendo.ui.progress($("body"), 0);
                }
            });
        }
    }
}

// =========================================================
// REBUILD PIVOT DROP-DOWN
// =========================================================
var rebuild_cella_dropdown = function() {
    if($(".k-grid:visible").attr("id") == "grid-deepdive") {
        if(vPIVOT_DATA_SOURCE.length > 0) {
            $(".k-grid:visible .tb-cell-a").html("<div/>").find("div").kendoDropDownList({
                animation: false
            ,   dataTextField: "text"
            ,   dataValueField: "value"
            ,   index: vPIVOT_DROP_INDEX
            ,   dataSource: {
                    data: vPIVOT_DATA_SOURCE
                }
            ,   valueTemplate: (vPIVOT_DROP_HEADER == "") ? "" : '<span class="category-name">' + vPIVOT_DROP_HEADER + "</span>:<span> ${text}</span>"
            ,   change: function(e) {
                    vPIVOT_DROP_INDEX = this.select();
                    $(".k-grid:visible .tb-cell-a").attr({
                        "data-child-ids": e.sender.value()
                    });
                    load_xtab_data();
                }
            });
        }
    }
}

// =========================================================
// REBUILD GRID
// =========================================================
var rebuild_xtab_grid = function(_GRID, _DATA, _COLUMNS) {
    var _thisGrid = _GRID.kendoGrid({
        dataSource: _DATA
    ,   columns: _COLUMNS
    ,   toolbar: kendo.template($("#toolbar-xtab").html())
    ,   excel: {
            allPages: true
        ,   proxyURL: "/"
        }
    ,   dataBound: function(e) {
//            var cells = ["a", "b", "c"];
//            cells.forEach(function(i) {
//                $(e.sender.wrapper).find(".tb-cell-" + i + " .toolbar-droppable").parent().addClass("transition-backgroundcolor transition-color").droppable({
//                    scope: "xtab-draggable"
//                ,   tolerance: "pointer"
//                ,   drop: function(e, ui) {xtab_draggable_drop(e, ui, this);}
//                ,   over: function(e, ui) {$(this).css({"background-color": "#1e824c"}).find(".toolbar-droppable").css({"color": "#FFF"});}
//                ,   out: function(e, ui) {$(this).css({"background-color": ""}).find(".toolbar-droppable").css({"color": ""});}
//                });
//            });
            // -------------------------------------
            // PAGE DROPPABLE
            // -------------------------------------
            $(e.sender.wrapper).find(".tb-cell-a .toolbar-droppable").parent().addClass("transition-backgroundcolor transition-color").droppable({
                scope: "xtab-draggable"
            ,   tolerance: "pointer"
            ,   drop: function(e, ui) {
                    xtab_draggable_drop(e, ui, this);
                }
            ,   over: function(e, ui) {
                    $(this).css({"background-color": "#1e824c"}).find(".toolbar-droppable").css({color: "#FFF"});
                }
            ,   out: function(e, ui) {
                    $(this).css({"background-color": ""}).find(".toolbar-droppable").css({color: ""});
                }
            });
            // -------------------------------------
            // BANNER DROPPABLE
            // -------------------------------------
            $(e.sender.wrapper).find(".tb-cell-b  .toolbar-droppable").parent().addClass("transition-backgroundcolor transition-color").droppable({
                scope: "xtab-draggable"
            ,   tolerance: "pointer"
            ,   drop: function(e, ui) {
                    xtab_draggable_drop(e, ui, this);
                }
            ,   over: function(e, ui) {
                    $(this).css({
                        "background-color": "#1e824c"
                    }).find(".toolbar-droppable").css({
                        color: "#FFF"
                    });
                }
            ,   out: function(e, ui) {
                    $(this).css({
                        "background-color": ""
                    }).find(".toolbar-droppable").css({
                        color: ""
                    });
                }
            });
            // -------------------------------------
            // STUBS DROPPABLE
            // -------------------------------------
            $(e.sender.wrapper).find(".tb-cell-c .toolbar-droppable").parent().addClass("transition-backgroundcolor transition-color").droppable({
                scope: "xtab-draggable"
            ,   tolerance: "pointer"
            ,   drop: function(e, ui) {
                    xtab_draggable_drop(e, ui, this);
                }
            ,   over: function(e, ui) {
                    $(this).css({
                        "background-color": "#1e824c"
                    }).find(".toolbar-droppable").css({
                        color: "#FFF"
                    });
                }
            ,   out: function(e, ui) {
                    $(this).css({
                        "background-color": ""
                    }).find(".toolbar-droppable").css({
                        color: ""
                    });
                }
            });
        }
    }).data("kendoGrid");
    if(_thisGrid.wrapper.attr("id") == "grid-listview") {
        // -------------------------------------
        // Remove grid row
        // -------------------------------------
        var i = 0, timeOut = 0;
        _thisGrid.tbody.find("tr").not(".tb-benchmark").each(function() {
            $(this).bind("mousedown touchstart", function(e) {
                i = 0
            ,   timeOut = 0;
                timeOut = setInterval(function() {
                    $(e.currentTarget).addClass("k-state-selected");
                    if(i++ == 10) {
                        var _confirm_delete = confirm("Are you sure you want to delete this row?");
                        if(_confirm_delete) {
                            var removeItem = parseInt($(e.currentTarget).find("td:first").text())
                            ,   currentItems = $(".k-grid:visible .tb-cell-c").attr("data-child-ids").split(",").map(Number);
                            for(var j = 0 ; j < currentItems.length ; j++) {
                                if(currentItems[j] == removeItem) {
                                    currentItems.splice(j, 1);
                                }
                            }
                            $(".k-grid:visible .tb-cell-c").attr("data-child-ids", currentItems.join());
                            _thisGrid.removeRow(e.currentTarget);
                            load_xtab_data();
                        }
                    }
                }, 100);
            }).bind("mouseup mouseleave touchend", function(e) {
                $(e.currentTarget).removeClass("k-state-selected");
                clearInterval(timeOut);
            });
        });

        var listMetricIds = [];
        _GRID.find(".k-grid-header:last th[data-metric-id]").each(function() {
            listMetricIds.push($(this).attr("data-metric-id"));
        });
        _GRID.addClass("tb-datapull").find(".tb-cell-b").attr({
            "data-axis": "columns"
        ,   "data-axis-source": "metrics"
        ,   "data-ids": ""
        ,   "data-child-ids": listMetricIds.join()
        });
        // -------------------------------------
        // Add stat test identifiers
        // -------------------------------------
        _GRID.find(".tb-benchmark").removeClass("tb-benchmark");
        if(_GRID.data("kendoGrid")) {
            if(_thisGrid.dataSource.data().length > 0) {
                if(_thisGrid.dataSource.data()[0]._identifier == "") {
                    if(_thisGrid.dataSource.data()[0]._identifier == "") {
                        _GRID.find(".k-grid-content tbody tr:first").addClass("tb-benchmark").find("td:eq(1)").html(_GRID.find(".k-grid-content tbody tr:first td:eq(1) a").text());
                        _GRID.find(".k-grid-content td[class*='template-parity-']").removeClass("template-parity-above template-parity-below template-parity-");
                        var thisData = _thisGrid.dataSource.data()[0];
                        for(var obj in thisData) {
                            if(thisData.hasOwnProperty(obj)) {
                                var _COLUMN = _GRID.find("thead").find("th[data-field=" + obj.replace(/_stat_[GL]T$/g, "") + "]").index()
                                ,   _ROWS = (thisData[obj] + "").split("");
                                if(obj.substr(-3) == "_LT" || obj.substr(-3) == "_GT") {
                                    var _CLASS = "";
                                    if(obj.substr(-3) == "_LT") {
                                        _CLASS = "above";
                                    } else if(obj.substr(-3) == "_GT") {
                                        _CLASS = "below";
                                    }
                                    for(var i = 0 ; i < _ROWS.length ; i++) {
                                        _ROW = _ROWS[i].charCodeAt(0) - 96;
                                        _GRID.find(".k-grid-content tr:eq(" + _ROW + ") td:eq(" + _COLUMN + ")").addClass("template-parity-" + _CLASS);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    resize_xtab_grid();
}

// =========================================================
// REBUILD GRID
// =========================================================
var scorecard_links = function() {
    $(".scorecard-product").unbind().bind("click", function() {
        if($(this).parent().next().text() == "") {
            alert("This product has no data for the selected Date(s).")
        } else {
            var thisID = $(this).attr("data-item-id")
            ,   thisText = $(this).text()
            ,   _selectedDType = get_selected_datetype()
            ,   itemCategory = "Category"
            ,   thisCatID = $(this).attr("data-category-id")
            ,   thisData = treePRODUCTS.dataSource.data();
            windowScorecard.open();
            windowScorecard.element.css({
                width: ($(window).width() * .99)
            ,   height: ($(window).height() * .99)
            }).attr("data-item-id", thisID);
            windowScorecard.wrapper.css({
                "padding-top": 0
            }).find(".k-window-titlebar").hide();
            windowScorecard.center();
            $(".container-gridster").html('<div style="width:100%;height:100%;" class="gridster"><ul class="gridul"></ul></div>');
            gridster = windowScorecard.element.find(".gridster > ul").gridster({
                widget_margins: [1, 1]
            ,   widget_base_dimensions: [Math.floor(windowScorecard.wrapper.innerWidth() / 12) - 2, Math.floor(windowScorecard.wrapper.height() / 9.6) - 2]
            ,   max_cols: 12
            }).data("gridster").disable();
            var widgets = vDataScorecardLayout;
            $.each(widgets, function(i, widget){
                gridster.add_widget.apply(gridster, widget);
            });
            gridster.$widgets.each(function() {
                kendo.ui.progress($(this), 1);
            });
            gridster.$widgets.eq(0).addClass("text-center").html('<img src="imgs/product-' + thisID + '.png" height="100%"/>');
            gridster.$widgets.eq(1).html("<div class='text-center vertical-center' style='font-size:2em;'>" + thisText + "</div>");
            gridster.$widgets.eq(8).html($(".scorecard-info").clone().removeClass("scorecard-info")).css({
                "line-height": "1.25em"
            ,   "font-size": "13px"
            ,   "overflow": "hidden"
            ,   "overflow-y": "scroll"
            }).find(".feedback-category").text(itemCategory);
            var feedback = [];
            if($(".feedback-filters").text().length > 0) {
                feedback.push("Filters Selected:<br/>" + $(".feedback-filters").text());
            }
            if($(".feedback-dates").text().length > 0) {
                var thisTree = $("#tree-dates").data("kendoTreeView")
                ,   thisDate = thisTree.getCheckedItems()
                ,   thisYear = thisDate[thisDate.length - 1].year
                ,   thisQtr  = thisDate[thisDate.length - 1].quarter;
                feedback.push(thisYear + " " + thisQtr + " (most recent selected)");
            }
            gridster.$widgets.eq(12).html(feedback.join("<br/><br/>")).css({
                padding: "10px"
            ,   width: gridster.$widgets.eq(12).width() - 20
            ,   height: gridster.$widgets.eq(12).height() - 20
            });
            update_scorecard(thisID);
            window.flexVerticalCenter($(".vertical-center"));
            if(_selectedDType == 0) {
                $(".k-window .info-year").hide();
            } else {
                $(".k-window .info-year").show();
            }
        }
        return false;
    });
}

// =========================================================
// COMPILE SELECTED FILTERS
// =========================================================
var get_selected_filters = function() {
    vCurrentItems = $("#tree-filters").data("kendoTreeView").getCheckedItems();
    var _string = ""
    ,   FILTERS_SELECTED = []
    ,   idx = 0;
    for(var i = 0 ; i < vCurrentItems.length ; i++) {
        if(typeof vCurrentItems[i].filter_id !== "undefined") {
            _period = "";
            if(i > 0) {
                _period = ". ";
            }
            if(_string.substr(-2) == ", ") {
                _string = _string.substr(0, _string.length - 2);
            }
            _string += _period + vCurrentItems[i].text + ": ";
        } else {
            _string += vCurrentItems[i].text + ", ";
        }
    }
    _string = _string.substr(0, _string.length - 2) + ".";
    if(_string == ".") {
        _string = "";
    }
    $(".feedback-filter").text(_string);
    for(var i = 0 ; i < vCurrentItems.length ; i++) {
        if(vCurrentItems[i].hasChildren == true) {
            FILTERS_SELECTED[idx] = [];
            FILTERS_SELECTED[idx].push(vCurrentItems[i].filter_id);
            for(var j = 0 ; j < vCurrentItems[i].items.length ; j++) {
                if(vCurrentItems[i].items[j].checked == true) {
                    FILTERS_SELECTED[idx].push(vCurrentItems[i].items[j].id);
                }
            }
            idx++;
        }
    }
    return FILTERS_SELECTED;
}

// =========================================================
// COMPILE SELECTED DATES
// =========================================================
var update_date_feedback = function() {
    var listMonths = $("#tree-dates").data("kendoTreeView").getCheckedItems()
    ,   _LY = _LQ = _LM = 0
    ,   j = -1
    ,   _DATES = []
    ,   _FEEDBACK = "";
    if(listMonths.length == 0) {
        $(".feedback-dates").empty();
    } else {
        for(var i = 0 ; i < listMonths.length ; i++) {
            // Compile YEARS
            if(typeof listMonths[i].year_id !== "undefined" && typeof listMonths[i].quarter_id == "undefined") {
                j++;
                _LY = listMonths[i].text;
                _DATES[j] = [
                    {
                        y: _LY
                    ,   qc: 0
                    ,   mc: 0
                    ,   m: []
                    }
                ];
            }
            // Compile QUARTERS
            if(typeof listMonths[i].year_id !== "undefined" && typeof listMonths[i].quarter_id !== "undefined" && typeof listMonths[i].month_id == "undefined") {
                _LQ = listMonths[i].text.replace(/uarter /g, "");
                _DATES[j].push([
                    {
                        y: _LY
                    ,   q: _LQ
                    ,   qc: (_DATES[j][0].qc + 1)
                    ,   m: []
                    ,   mc: _DATES[j][0].mc
                    }
                ]);
            }
            // Compile MONTHS
            if(typeof listMonths[i].month_id !== "undefined") {
                _LM = listMonths[i].text.substr(0, 3);
                _CM = _DATES[j][0].m;
                _DATES[j][0].m.push(_LM);
                _DATES[j].push([
                    {
                        y: _LY
                    ,   q: _LQ
                    ,   qc: _DATES[j][0].qc
                    ,   m: _CM
                    ,   mc: (_DATES[j][0].mc + 1)
                    }
                ]);
            }
        }
        y = 0;
        for(var i = 0 ; i < _DATES.length ; i++) {
            var _break = "";
            if(_DATES[i][0].y != "All") {
                if(i > 0 && y > 1) {
                    _break = "<br/>";
                }
                _FEEDBACK += _break + _DATES[i][0].y;
            }
            if(_DATES[i][0].mc == 3) {
                _FEEDBACK += " " + _DATES[i][0].q;
            } else {
                if(_DATES[i][0].qc < 4 && _DATES[i][0].y != "All") {
                    _FEEDBACK += " (" + _DATES[i][0].m + ")";
                }
            }
            $(".feedback-dates").html(_FEEDBACK);
            y++;
        }
    }
}

/* ========================================================================== */
/* MAIN                                                                       */
/* ========================================================================== */
$(document).ready(function() {
    // -------------------------------------
    // Resize tabstrip when page is resized
    // -------------------------------------
    $(window).resize(function() {
        resizeAll();
    });

    // Add clear restaurant callback
    $(".xtab-remove-list").click( remove_pasted_stores );
    $(".xtab-update-range").click( load_xtab_data );

    // -------------------------------------
    // FULL PAGE TABSTRIP
    // -------------------------------------
    _tabsWorkspaceE = $("#pane-tabs").kendoTabStrip({
        animation: false
    ,   activate: function(e) {
            uberMenu.wrapper.find(">li").slideDown(250);
            switch($(e.item).index()) {
                case 0:
                    uberMenu.wrapper.find(">li").not(":last").slideUp(250);
                    break;
                case 1:
                    uberMenu.wrapper.find(">li").slideDown(250);
                    uberMenu.wrapper.find(">li:eq(2), >li:eq(5), >li:eq(6)").slideUp(250);
                    break;
                case 2:
                    uberMenu.wrapper.find(">li").slideDown(250);
                    uberMenu.wrapper.find(">li:eq(2)").slideDown(250);
                    break;
//                case 3:
//                    _tabsWorkspaceE.find("li:eq(" + $(e.item).index() + ")").removeClass("tabs-highlight");
//                    uberMenu.wrapper.find(">li, >li:eq(6)").slideDown(250);
//                    uberMenu.wrapper.find(">li:eq(2), >li:eq(4), >li:eq(5)").slideUp(250);
//                    break;
                case 3:
                    _tabsWorkspaceE.find("li:eq(" + $(e.item).index() + ")").removeClass("tabs-highlight");
                    uberMenu.wrapper.find(">li").not(":last").slideUp(250);
                    break;
            }
            $(window).trigger("resize");
            setTimeout(function() {
                resizeAll();
            }, 250);
        }
    });

    _tabsDates = $("#tabs-dates").kendoTabStrip({
        animation: false
    ,   activate: function(e) {
            if($("div.xtab-page-drop").data("kendoDropDownList")) {
                update_date_feedback();
                $("div.xtab-page-drop").data("kendoDropDownList").trigger("change");
            }
        }
    }).data("kendoTabStrip");

    // =============================================================================
    // METADATA
    // =============================================================================
    $(".progress-checkmark td:first span").removeClass("icon-hour-glass2").addClass("icon-checkmark");
    var metaForm = new FormData();
    metaForm.append("wbrs_test", $.cookie("wbrs_test_token"));
    metaForm.append("midfield", midfield);
    $.ajax({
        dataType: "json"
    ,   url: siteBase + "index.php?/metajson/index"
    ,   data: metaForm
    ,   processData: false
    ,   contentType: false
    ,   type: "POST"
    ,   success: function(result) {
            $(".progress-checkmark td:last span").removeClass("icon-hour-glass2").addClass("icon-checkmark");
            MINMAX = result.MINMAX;
            var   MAX_QTR = result.MAX_QTR
            ,   FILTERS = result.FILTERS
            ,   COLS_XTAB = result.COLS_XTAB
            ,   _dataColsUsers = result.USER_COLUMNS
            ,   _dataUserAccess = new kendo.data.DataSource({data: result.USER_ACCESS})
            ,   _dataUserCompany = new kendo.data.DataSource({data: result.USER_COMPANY})
            ,   _dataPreDefined = new kendo.data.DataSource({data: result.PREDEFINED});
            DATES = new kendo.data.HierarchicalDataSource({data: result.DATES});
            __YEARS = result.YEARS;
            __QUARTERS = result.QUARTERS;
            PRODUCTS = result.PRODUCTS;
            vDataProductsFlat = new kendo.data.DataSource({data: result.PRODUCT_FLAT});
            METRICS = result.METRICS;
            COLS_LIST = result.COLS_LIST;
            COLS_COMP = result.COLS_COMP;
            USER_OPTIONS = result.USER_OPTIONS;
            vDataMetricsCats = new kendo.data.DataSource({data: result.CATEGORY_DATA});
            vDataUserList = new kendo.data.DataSource({data: result.USER_LIST});
            vDataScorecardLayout = result.SCORECARD_LAYOUT;

            // =============================================================================
            // BATCH EXPORT
            // =============================================================================
            for(var i = 0 ; i < __YEARS.length ; i++) {
                $(".batch-year").append('<option val="' + __YEARS[i].year_id + '">' + __YEARS[i].text + '</option>');
            }
            for(var i = 0 ; i < __QUARTERS.length ; i++) {
                $(".batch-quarter").append('<option val="' + __QUARTERS[i].quarter_id + '">' + __QUARTERS[i].text + '</option>');
            }
            $(".batch-year, .batch-quarter").kendoDropDownList();
            $("input[name='date-type[]']").unbind().bind("click", function(e) {
                if($("input[name='date-type[]']:checked").val() == "year") {
                    $("span.batch-year").removeClass("display-none");
                    $("span.batch-quarter").addClass("display-none");
                } else {
                    $("span.batch-quarter").removeClass("display-none");
                    $("span.batch-year").addClass("display-none");
                }
            });

            // =============================================================================
            // SETTINGS
            // =============================================================================
            $("input[name='overwriteDates[]']:eq(0)").prop("checked", (USER_OPTIONS.bool_overwrite_dates == 1) ? true : false);
            $("input[name='overwriteDates[]']:eq(1)").prop("checked", (USER_OPTIONS.bool_overwrite_dates == 0) ? true : false);
            $("input[name='overwriteProducts[]']:eq(0)").prop("checked", (USER_OPTIONS.bool_overwrite_products == 1) ? true : false);
            $("input[name='overwriteProducts[]']:eq(1)").prop("checked", (USER_OPTIONS.bool_overwrite_products == 0) ? true : false);
            $("input[name='overwriteMetrics[]']:eq(0)").prop("checked", (USER_OPTIONS.bool_overwrite_metrics == 1) ? true : false);
            $("input[name='overwriteMetrics[]']:eq(1)").prop("checked", (USER_OPTIONS.bool_overwrite_metrics == 0) ? true : false);

            // =============================================================================
            // DATE HIERARCHY
            // =============================================================================
            treeDATES = $("#tree-dates").kendoTreeView({
                animation: false
            ,   dataSource: DATES
            ,   checkboxes: {
                    checkChildren: true
                ,   template: '<input type="checkbox" data-year-id="${item.year_id}" data-quarter-id="${item.quarter_id}" data-month-id="${item.month_id}"/>'
                }
            ,   select: treeview_post_select
            }).data("kendoTreeView");
            treeDATES.dataSource.bind("change", function(e) {
                if(e.field == "checked") {
                    update_date_feedback();
                    if($(".k-grid:visible").attr("id") == "grid-listview") {
                        change_listDATE_SELECTIONS();
                    }
                    load_xtab_data();
                }
            });
            treeDATES.collapse(treeDATES.element.find(".k-item").not(":first"));

            // =============================================================================
            // DATE RANGE
            // =============================================================================
            $("#date-from, #date-to").each(function(i) {
                $(this).kendoDatePicker({
                    min: MINMAX[0]
                ,   max: MINMAX[1]
                ,   value: MINMAX[i]
                ,   change: function(e) {
                        if($("div.xtab-page-drop").data("kendoDropDownList")) {
                            update_date_feedback();
                            $("div.xtab-page-drop").data("kendoDropDownList").trigger("change");
                        }
                    }
                });
            });
            /*$("#tabs-dates-2").addClass("draggable-daterange").draggable({
                scope: "xtab-draggable"
            ,   appendTo: "body"
            ,   helper: "clone"
            ,   containment: "window"
            ,   zIndex: 11001
            ,   drag: function(e, ui) {
                    vCurrentDraggable = ui.helper.context;
                }
            });
            */

            // =============================================================================
            // OTHER HIERARCHIES
            // =============================================================================
            var _hierarchy = ["Products", "Metrics", "Filters"];
            for(var i = 0 ; i < _hierarchy.length ; i++) {
                var thisLower = _hierarchy[i].toLowerCase()
                ,   thisHier = _hierarchy[i].toUpperCase()
                ,   thisData;
                switch(_hierarchy[i]) {
                    case "Products":
                        thisData = new kendo.data.HierarchicalDataSource({
                            data: PRODUCTS
                        });
                        break;
                    case "Metrics":
                        thisData = new kendo.data.HierarchicalDataSource({
                            data: METRICS
                        });
                        break;
                    case "Filters":
                        thisData = new kendo.data.HierarchicalDataSource({
                            data: FILTERS
                        });
                        break;
                }
                thisTree = $("#tree-" + thisLower).kendoTreeView({
                    animation: false
                ,   dataSource: thisData
                ,   template: kendo.template($("#template-" + thisLower).html())
                ,   checkboxes: {
                        checkChildren: (thisHier == "FILTERS") ? true : false
                    ,   template: (thisHier == "FILTERS") ? '<input type="checkbox" value="${item.id}" data-filter-id="${item.filter_id}"/>' : ""
                    }
                ,   select: treeview_post_select
                }).data("kendoTreeView");
                switch(_hierarchy[i]) {
                    case "Products":
                        vDataProducts = new kendo.data.HierarchicalDataSource({
                            data: PRODUCTS
                        });
                        treePRODUCTS = thisTree;
                        break;
                    case "Metrics":
                        thisTree.element.find("> ul > li").each(function() {
                            if($(this).text().indexOf("<span") > -1) {
                                $("> div > span:last", this).html($("> div > span:last", this).text());
                            }
                        });
                        vDataMetrics = new kendo.data.HierarchicalDataSource({
                            data: METRICS
                        });
                        treeMETRICS = thisTree;
                        break;
                    case "Filters":
                        vDataFiltersClean = FILTERS;
                        vDataFilters = new kendo.data.HierarchicalDataSource({
                            data: FILTERS
                        });
                        $("> ul > li", thisTree.element).each(function() {
                            $(this).attr({"data-fromeq": parseInt($("> div > span.k-checkbox > :checkbox", this).attr("data-filter-id"))});
                        });
                        // -------------------------------------
                        // Build Filter feedback
                        // -------------------------------------
                        thisTree.dataSource.bind("change", function(e) {
                            if(e.field == "checked") {
                                load_xtab_data();
                            }
                        });
                        treeFILTERS = thisTree;
                        break;
                }
                update_product_counts();
                thisTree.collapse(".k-item");
            }
            // =============================================================================
            // LIST VIEW
            // =============================================================================
            rebuild_xtab_grid($("#grid-listview"), vDataListView, COLS_LIST);
            _gridListView = $("#grid-listview");
            set_toolbar_buttons();
            set_listview_droppables();

            // =============================================================================
            // XTAB
            // =============================================================================
            rebuild_xtab_grid($("#grid-deepdive"), vDataDeepDive, vDefaultCols);
            set_xtab_toolbar();

            // =============================================================================
            // WORD CLOUDS
            // =============================================================================
            $(".listview-predefined").kendoListView({
                dataSource: _dataPreDefined
            ,   template: kendo.template($("#template-predefined").html())
            });
            $(".tb-predefined").draggable({
                scope: "xtab-draggable"
            ,   appendTo: "body"
            ,   helper: "clone"
            ,   containment: "window"
            ,   zIndex: 11001
            ,   drag: function(e, ui) {
                    vCurrentDraggable = ui.helper.context;
                }
            });

            // =============================================================================
            // USER ADMINISTRATION
            // =============================================================================
            _userAccess = $(".list-user-admin").kendoGrid({
                dataSource: vDataUserList
            ,   columns: _dataColsUsers
            ,   resizable: false
            ,   draggable: false
            ,   selectable: "single row"
            ,   dataBound: function(e) {
                    e.sender.content.find("tr").each(function() {
                        $("td:eq(5)", this).html($("td:eq(5)", this).text());
                    });
                    $(".access-level").kendoDropDownList({
                        animation: false
                    ,   dataSource: _dataUserAccess
                    ,   dataTextField: "text"
                    ,   dataValueField: "id"
                    ,   index: "${access}"
                    ,   change: check_user_list
                    ,   enable: _ENABLED
                    });
                    $(".access-company").kendoDropDownList({
                        animation: false
                    ,   dataSource: _dataUserCompany
                    ,   dataTextField: "text"
                    ,   dataValueField: "id"
                    ,   index: "${id}"
                    ,   valueTemplate: '<span style="padding:0 8px;background:url(imgs/icon-${iclass}.png) no-repeat center transparent;margin-right:0.2em">&nbsp;</span>'
                    ,   change: check_user_list
                    ,   enable: _ENABLED
                    });
                    $(".access-username, .access-email").prop("disabled", !_ENABLED).unbind().bind("keyup", function() {
                        check_user_list();
                    });
                    setTimeout(function() {
                        kendo.ui.progress($(".window-user-admin .k-grid"), 0);
                    }, 500);
                }
            }).data("kendoGrid");
            // =============================================================================
            // DOWNLOADS
            // =============================================================================
            _dataDownloadsNEW = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/pushNotify/etc/wendys.json"
                    ,   dataType: "json"
                    }
                }
            ,   autoSync: true
            });
            gridDownloads = $("#data-documents").kendoGrid({
                dataSource: _dataDownloadsNEW
            ,   columns: [
                    {id: 1, field: "export_id",            title: "ID",            hidden: true}
                ,   {id: 2, field: "export_key",           title: "Export Key",    hidden: true}
                ,   {id: 3, field: "export_date",          title: "date Created",  width: 160, headerAttributes: {"class": "noborder-left"}, attributes: {"class": "noborder-left text-center"}, format: "{0: yyyy-MM-dd HH:mm tt}", template: "#=export_date#"}
                ,   {id: 4, field: "user_id",              title: "User ID",       hidden: true}
                ,   {id: 5, field: "export_type",          title: "Type",          hidden: true}
                ,   {id: 6, field: "export_title",         title: "Download link", template: kendo.template($("#template-download-list").html())}
                ,   {id: 7, field: "product_ids",          title: "Product ID's",  hidden: true}
                ,   {id: 8, field: "export_complete_flag", title: "Complete",      hidden: true}
                ,   {id: 9, field: "export_status",        title: "Status",        width: 160, attributes: {"class": "text-center"}, template: '<div class="progress" style="width:140px;"></div>'}
                ]
            ,   dataBound: function(e) {
                    var grid = this;
                    $(".progress").each(function() {
                        var row = $(this).closest("tr"), model = grid.dataItem(row);
                        if(model.export_status == "Ready" || model.export_status == "Queued" || model.export_status == "Writing") {
                            $(this).text(model.export_status);
                        } else {
                            $(this).kendoProgressBar({
                                value: model.export_status.replace("%", "")
                            ,   min: 0
                            ,   max: 100
                            }).data("kendoProgressBar").progressStatus.text(model.export_status);
                        }
                    })
                    resize_download_grid();
                }
            }).data("kendoGrid");
            setInterval(function() {
                _dataDownloadsNEW.read();
            }, 1000 * 15 * 1);
            $(".page-loader").fadeOut();
        }
    });

    // =============================================================================
    // BERMENU
    // =============================================================================
    uberMenu = $("#panelbar-ubermenu").kendoPanelBar({
        animation: false
    ,   expandMode: "single"
    ,   expand: function(e) {
            if($(e.item).find(".k-treeview").length > 0) {
                kendo.ui.progress($("#menu-side"), 1);
                xtab_draggables($("#tree-" + $(e.item).find(".k-treeview").attr("id").split("-")[1]).data("kendoTreeView"));
            }
        }
    }).data("kendoPanelBar");
    uberMenu.wrapper.find(">li").not(":last").hide();
    $(".list-buttons button").each(function() {
        $(this).kendoButton({
            click: function(e) {
                $(".k-widget.k-window .k-window-content[data-action=" + this.element.data("action") + "]").data("kendoWindow").center().open();
            }
        });
    });
    // -------------------------------------
    // RESTAURANT LOOKUP
    // -------------------------------------
    $(".search-restaurants").unbind().bind("paste", function() {
        kendo.ui.progress($("#list-restaurants"), 1);
        elPaste = $(this);
        setTimeout(function() {
            paste_values = elPaste.val().replace(/ /g, ",").replace(/\t/g, ",").split(",").map(Number);
            $("#list-restaurants :checkbox:checked").each(function() {
                if(typeof $(this).attr("data-composite-id") == "undefined") {
                    paste_values.push(parseInt($(this).attr("data-item-id")));
                }
            });
            $(".paste-list-count").text(numberWithCommas(paste_values.length));
            $(".paste-list").data("kendoButton").enable(true);
            windowPasteList.element.find("input").val("");
            windowPasteList.center().open();
        }, 333);
    });
    // -------------------------------------
    // WINDOWS
    // -------------------------------------
    windowScorecard = new_window($(".window-scorecard"), "");
    windowStay = new_window($(".window-expiration"), "action Required");
    windowPasteList = new_window($(".window-paste-list"), "name your List?");
    windowSavedFile = new_window($(".window-saved-file"), "download Ready");
    windowSettings = new_window($(".window-settings"), "application Settings");
    windowProdDrop = new_window($(".window-catsubcat-drop-opts"), "Product Options");
    windowDateDrop = new_window($(".window-date-drop-opts"), "Date Options");
    windowExit = new_window($(".window-exit"), "exit Tabulous");
        $(".exit-text").text(vEXIT[Math.floor(Math.random() * vEXIT.length)]);
    windowClear = new_window($(".window-clear-xtab"), "Clear Data");
    windowUserAdmin = new_window($(".window-user-administration"), "User Administration");
    windowSwitch = new_window($(".window-switch"), "switch to BRS");
    windowWordCloud = new_window($(".window-wordcloud"), "");
        windowWordCloud.wrapper.css("padding-top", 0).find(".k-window-titlebar").hide();
    windowSaveFile = new_window($(".window-save-file"), "Save File");
        windowSaveFile.element.find("input:text").bind("keyup", function(e) {
            var thisButton = windowSaveFile.element.find("button.export-batch").data("kendoButton");
            if($(this).val().trim().length > 9 && $(this).val().trim().length < 61) {
                thisButton.enable(true);
            } else {
                thisButton.enable(false);
            }
        });
    $(".user-admin-actions button, .k-widget.k-window button, .hide-menu, .user-manual").each(function() {
        $(this).kendoButton({
            click: function(e) {
                var _action = e.sender.wrapper.data("action");
                switch(_action) {
                    case "add":
                        kendo.ui.progress($("#window-user-administration .k-grid"), 1);
                        setTimeout(function() {
                            vDataUserList.add({
                                id: vDataUserList.data().length
                            ,   company: 0
                            ,   name: "John Doe"
                            ,   email: "jdoe@email.com"
                            ,   access: 2
                            ,   "isNew": true
                            });
                            for(var i = 0 ; i < vDataUserList.data().length ; i++) {
                                if(vDataUserList.data()[i]["isNew"]) {
                                    $("tr[data-uid=" + vDataUserList.data()[i].uid + "]").addClass("new-user");
                                }
                            }
                            kendo.ui.progress($("#window-user-administration .k-grid"), 0);
                        }, 250);
                        break;
                    case "clear-compview":
                        var _confirm_clear = confirm("Are you sure you want to clear your current Comparison Set?");
                        if(_confirm_clear) {
                            $(".k-grid:visible").data("kendoGrid").dataSource.data([]);
                            close_active_window();
                        }
                        break;
                    case "clear-deepdive":
                        var _confirm_clear = confirm("Are you sure you want to clear your current data & selections?");
                        if(_confirm_clear) {
                            clear_xtab_grid();
                        }
                        break;
                    case "clear-listview":
                        var _confirm_clear = confirm("Are you sure you want to clear current List data?");
                        if(_confirm_clear) {
                            $("#grid-listview").data("kendoGrid").dataSource.data([]);
                            close_active_window();
                        }
                        break;
                    case "clear-complistview":
                        var _confirm_clear = confirm("Are you sure you want to clear current data?");
                        if(_confirm_clear) {
                            $("#grid-listview").data("kendoGrid").dataSource.data([]);
                            close_active_window();
                        }
                        break;
                    case "close":
                        close_active_window();
                        break;
                    case "export-pptx":
                        windowSaveFile.center().open();
                        windowSaveFile.element.find(".save-options").hide();
                        break;
                    case "exit":
                        window.location = siteBase + "index.php?/login/logout";
                        break;
                    case "hide-menu":
                        this.element.toggleClass("width-narrow");
                        if(this.element.hasClass("width-narrow")) {
                            $("#menu-side").animate({
                                right: "-20%"
                            }, "fast");
                            $("#workspace").animate({
                                width: "97%"
                            }, "fast", function() {
                                resizeAll();
                            });
                        } else {
                            $("#menu-side").animate({
                                right: "0%"
                            }, "fast");
                            $("#workspace").animate({
                                width: "77%"
                            }, "fast", function() {
                                resizeAll();
                            });
                        }
                        break;
                    case "paste-list":
                        $(".paste-list").data("kendoButton").enable(false);
                        var deferreds = []
                        ,   LIST_ID = new Date();
                        LIST_ID = Math.abs(LIST_ID.toString().replace(/ /g, "").hashCode());
                        array_paste_values = paste_values.join().chunk(1024);
                        var LIST_NAME = "";
                        if($(".window-paste-list input").val() !== "") {
                            LIST_NAME = $(".window-paste-list input").val();
                        }
                        for(i = 0 ; i < array_paste_values.length ; i++) {
                            deferreds.push(
                                $.ajax({
                                    dataType: "json"
                                ,   url: "services/meta-store.php"
                                ,   data: {
                                        LIST_ID: LIST_ID
                                    ,   STORE_IDS: array_paste_values[i]
                                    ,   INDEX: i
                                    }
                                ,   success: function(result) {}
                                ,   type: "POST"
                                })
                            );
                        }
                        $.when.apply($, deferreds).done(function() {
                            close_active_window();
                            LIST_ID = [LIST_ID];
                            $("#list-restaurants :checkbox:checked").each(function() {
                                if(typeof $(this).attr("data-composite-id") !== "undefined") {
                                    LIST_ID.push(parseInt($(this).attr("data-composite-id")));
                                }
                            });
                            $.ajax({
                                dataType: "json"
                            ,   url: "services/meta-store.php"
                            ,   data: {
                                    PASTE_LIST_ID: LIST_ID
                                ,   LIST_NAME: LIST_NAME
                                }
                            ,   type: "POST"
                            ,   success: function(result) {
                                    $(".search-restaurants").val("");
                                    var _STORE_HTML = result.STORE_HTML;
                                    $("#list-restaurants").append(_STORE_HTML).find("button").button().click(function(e) {
                                        $(e.target).parent().parent().parent().remove();
                                        load_xtab_data();
                                    });
                                    load_xtab_data();
                                    setTimeout(function() {
                                        kendo.ui.progress($("#list-restaurants"), 0);
                                    }, 250);
                                }
                            });
                        });
                        break;
                    case "pptx":
                        kendo.ui.progress($("#window-scorecard"), 1);
                        break;
                    case "remove":
                        var _confirm_delete = confirm("Are you sure you want to delete '" + _userAccess.tbody.find("tr.k-state-selected .access-username").val() + "'?");
                        if(_confirm_delete) {
                            _userAccess.removeRow(_userAccess.tbody.find("tr.k-state-selected"));
                            check_user_list();
                        }
                        break;
                    case "save-file":
                        if(windowSaveFile.element.find("input").val() !== "") {
                            var fileTitle = windowSaveFile.element.find("input").val();
                            if(_tabsWorkspaceE.data("kendoTabStrip").select().index() == 1) {
                                kendo.ui.progress(windowScorecard.element, 1);
                                if(windowScorecard.element.is(":visible")) {
                                    $(".export-pptx").data("kendoButton").enable(false);
                                    $.ajax({
                                        dataType: "json"
                                    ,   url: "pptx/"
                                    ,   data: {
                                            f: fileTitle
                                        ,   s: SCORECARD_KEY
                                        }
                                    ,   type: "POST"
                                    ,   success: function(result) {
                                            var fileName = result.PPTX;
                                            $(".pptx-link a").attr({
                                                "href": fileName
                                            }).text(fileTitle);
                                            windowSavedFile.center().open();
                                            $(".export-pptx").data("kendoButton").enable(true);
                                            kendo.ui.progress(windowScorecard.element, 0);
                                        }
                                    });
                                } else {
                                    var lengthList = $("#grid-listview").data("kendoGrid").dataSource.data().length;
                                    if(lengthList > 0 && $(".save-options :radio:checked").val() == 0) {
                                        var EXPORT_KEY = ""
                                        ,   batchProdList = [];
                                        _gridListView.find(".k-grid-content tr").each(function() {
                                            if($("td:eq(2)", this).text() !== "") {
                                                batchProdList.push(parseInt($("td:eq(0)", this).text()));
                                            }
                                        });
                                        $.ajax({
                                            dataType: "json"
                                        ,   url: siteBase + "index.php?/scorecardjson/index"
                                        ,   data: {
                                                product_id: batchProdList
                                            ,   date_type: get_selected_datetype()
                                            ,   scorecard_id: 1
                                            ,   batch_mode: 1
                                            ,   "wbrs_test": $.cookie("wbrs_test_token")
                                            }
                                        ,   type: "POST"
                                        ,   success: function(result) {
                                                SCORECARD_KEY = result.SCORECARD_KEY;
                                                var _SCORECARD = result.SCORECARD;
                                                var cell_id = [];
                                                for(i = 0 ; i < _SCORECARD.length ; i++) {
                                                    cell_id.push(_SCORECARD[i].slide_section_id);
                                                }
                                                var export_id = result.EXPORT_ID
                                                ,   deferreds = []
                                                ,   _filters = get_selected_filters()
                                                ,   vSelectedDate = get_selected_dates()
                                                ,   _selectedDType = get_selected_datetype()
                                                ,   _storeIds = get_selected_stores()
                                                ,   _confidenceLevel = get_confidence_level();
                                                deferreds.push(
                                                    $.ajax({
                                                        dataType: "json"
                                                    ,   url: "services/batch-data.php"
                                                    ,   data: {
                                                            EXPORT_ID: export_id
                                                        ,   CELL_ID: cell_id
                                                        ,   PRODUCT_ID: batchProdList
                                                        ,   FILTERS: _filters
                                                        ,   DATES: vSelectedDate
                                                        ,   DATE_TYPE: _selectedDType
                                                        ,   STORE_IDS: _storeIds
                                                        ,   CONFIDENCE: _confidenceLevel
                                                        }
                                                    ,   success: function(result) {}
                                                    })
                                                );
                                                $.when.apply($, deferreds).done(function() {
                                                    $.ajax({
                                                        dataType: "json"
                                                    ,   url: "services/batch-kickoff.php"
                                                    ,   data: {
                                                            EXPORT_ID: export_id
                                                        ,   FILE_NAME: fileTitle
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    } else {
                                        if($(".save-options :radio:checked").val() == 1) {
                                            vSelectedDate = get_selected_dates();

                                            $.ajax({
                                                dataType: "json"
                                            ,   url: siteBase + "index.php?/scorecardjson/index"
                                            ,   data: {
                                                    date_type: get_selected_datetype()
                                                ,   dates: vSelectedDate
                                                ,   scorecard_id: 1
                                                ,   batch_mode: 1
                                                ,   "wbrs_test": $.cookie("wbrs_test_token")
                                                }
                                            ,   type: "POST"
                                            ,   success: function(result) {
                                                    SCORECARD_KEY = result.SCORECARD_KEY;
                                                    var SCORECARD_KEY = result.SCORECARD_KEY;
                                                    var _SCORECARD = result.SCORECARD;
                                                    var batchProdList = result.PRODUCT_ID;
                                                    var cell_id = [];
                                                    for(i = 0 ; i < _SCORECARD.length ; i++) {
                                                        cell_id.push(_SCORECARD[i].slide_section_id);
                                                    }
                                                    var export_id = result.EXPORT_ID
                                                    ,   deferreds = []
                                                    ,   _filters = get_selected_filters()
                                                    ,   vSelectedDate = get_selected_dates()
                                                    ,   _selectedDType = get_selected_datetype()
                                                    ,   _storeIds = get_selected_stores()
                                                    ,   _confidenceLevel = get_confidence_level();
                                                    deferreds.push(
                                                        $.ajax({
                                                            dataType: "json"
                                                        ,   url: "services/batch-data.php"
                                                        ,   data: {
                                                                EXPORT_ID: export_id
                                                            ,   CELL_ID: cell_id
                                                            ,   PRODUCT_ID: batchProdList
                                                            ,   FILTERS: _filters
                                                            ,   DATES: vSelectedDate
                                                            ,   DATE_TYPE: _selectedDType
                                                            ,   STORE_IDS: _storeIds
                                                            ,   CONFIDENCE: _confidenceLevel
                                                            }
                                                        })
                                                    );
                                                    $.when.apply($, deferreds).done(function() {
                                                        $.ajax({
                                                            dataType: "json"
                                                        ,   url: "services/batch-kickoff.php"
                                                        ,   data: {
                                                                EXPORT_ID: export_id
                                                            ,   FILE_NAME: fileTitle
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        } else if($(".save-options :radio:checked").val() == 2) {
                                            console.log("ANNUAL REPORT");
                                        }
                                    }
                                }
                            } else if(_tabsWorkspaceE.data("kendoTabStrip").select().index() == 2) {
                                $.ajax({
                                    dataType: "json"
                                ,   url: "../ajax/xlsx/"
                                ,   type: "POST"
                                ,   success: function(result) {
                                        var fileName = result.FILE_NAME;
                                        _dataDownloads.add({
                                            id: _USER_ID + "" + randomString(32, "01234567890")
                                        ,   dateCreate: new Date()
                                        ,   fileType: "text"
                                        ,   fileTitle: fileTitle
                                        ,   fileName: fileName
                                        ,   criteria: ""
                                        ,   status: "Ready"
                                        });
                                        if(_tabsWorkspaceE.data("kendoTabStrip").select().index() !== 4) {
                                            _tabsWorkspaceE.find("li:eq(4)").addClass("tabs-highlight");
                                        }
                                    }
                                });
                            } else if(_tabsWorkspaceE.data("kendoTabStrip").select().index() == 3) {
                                _dataDownloads.add({
                                    id: _USER_ID + "" + randomString(32, "01234567890")
                                ,   dateCreate: new Date()
                                ,   fileType: "picture2"
                                ,   fileTitle: fileTitle
                                ,   fileName: thisPNG
                                ,   visibility: ""
                                ,   status: "Ready"
                                });
                            }
                            windowSaveFile.close();
                            windowSaveFile.element.find("input:text").val("");
                        } else {
                            alert("Enter some text to name this file");
                        }
                        break;
                    case "save-settings":
                        $.ajax({
                            dataType: "json"
                        ,   url: "services/update-options.php"
                        ,   data: {
                                USER_ID: uid
                            ,   BOOL_PRODUCTS: $("input[name='overwriteProducts[]']:eq(0)").prop("checked")
                            ,   BOOL_METRICS: $("input[name='overwriteMetrics[]']:eq(0)").prop("checked")
                            ,   BOOL_DATES: $("input[name='overwriteDates[]']:eq(0)").prop("checked")
                            }
                        ,   type: "POST"
                        ,   success: function(result) {
                                close_active_window();
                            }
                        });
                        break;
                    case "stay":
                        $.ajax({
                            dataType: "json"
                        ,   url: "../ajax/data/"
//                        ,   type: "POST"
                        ,   success: function(result) {
                                $(".expire-countdown").text(60);
                                clearInterval(vExpireInterval);
                                windowStay.close();
                            }
                        });
                        break;
                    case "submit-catsubcat-group":
                    case "submit-date-group":
                        process_xtab_drop(vCurrentE, _currentProdDrag, vCurrentThis);
                        break;
                    case "switch-source":
                        window.location.href = siteBase + "index.php?/app/brs/" + encodeURIComponent(midfield);
                        break;
                    case "update":
                        var _inviter_id = uid;
                        $("tr.new-user").each(function() {
                            var _company = $("td:visible:eq(0) input", this).data("kendoDropDownList").value()
                            ,   _username = $("td:visible:eq(1) input", this).val()
                            ,   _email = $("td:visible:eq(2) input", this).val()
                            ,   _access = $("td:visible:eq(3) input", this).data("kendoDropDownList").value();
                            $.ajax({
                                dataType: "json"
                            ,   url: "ajax/invite/"
                            ,   data: {
                                    i: _inviter_id
                                ,   c: _company
                                ,   u: _username
                                ,   e: _email
                                ,   a: _access
                                ,   n: _INVITE_ID
                                }
                            ,   type: "GET"
                            ,   success: function(result) {}
                            });
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    });

    $("input.input-stopwords").unbind().bind("keyup", function(e) {
        var _this = $(this);
        if(e.keyCode == 13) {
            var thisWord = _this.val(), boolUsed = false;
            $("#list-stopwords .stop-word").each(function() {
                if(boolUsed == false && thisWord == $(this).attr("data-value")) {
                    boolUsed = true;
                }
            });
            if(boolUsed == false) {
                var thisWord = $('<div class="stop-word client-fg-color" data-value="' + _this.val() + '"><button class="xtab-grid-icon-button xtab-remove-stub k-button" title="remove Row" data-role="button" role="button" aria-disabled="false" tabindex="0"><span aria-hidden="true" class="icon-cross"></span></button>&nbsp;' + _this.val() + '</div>');
                $("#list-stopwords").append(thisWord).find("button", thisWord).unbind().bind("click", function() {
                    $(thisWord).remove();
                });
            }
            _this.val("");
        }
    });
    resizeAll();
});