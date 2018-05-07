var dt = require("datatables.net")(window, $);
var moment = require('moment');

// import 'datatables.net-dt/css/jquery.dataTables.css';
console.log(dt);
//   元素选择
var selector = {
  AFFAIR_CONTAINER: $("#tableContainer"),

  NEW_AFFAIR: $("#affairNew"),
  NEW_FORM: $("#affairNew form"),
  NEW_REMIND_TYPE: $('#affairNew [name="type"]'),
  NEW_REMIND_TIME: $('#affairNew input[name="remindTime"]'),
  NEW_REMIND_WEEK: $('#affairNew [data-type="remindWeek"]'),
  NEW_REMIND_MONTH: $('#affairNew [data-type="remindMonth"]'),
  NEW_REMIND_DAY: $('#affairNew [data-type="remindDay"]'),
  NEW_SUBMIT: $('#affairNew button[type="button"]'),
  NEW_BEGIN_TIME: $('#affairNew [name="beginTime"]'),
  NEW_END_TIME: $('#affairNew [name="endTime"]'),

  EDIT_AFFAIR: $("#affairEdit"),
  EDIT_FORM: $("#affairEdit form"),
  EDIT_REMIND_TYPE: $('#affairEdit [name="type"]'),
  EDIT_REMIND_TIME: $('#affairEdit input[name="remindTime"]'),
  EDIT_REMIND_WEEK: $('#affairEdit [data-type="remindWeek"]'),
  EDIT_REMIND_MONTH: $('#affairEdit [data-type="remindMonth"]'),
  EDIT_REMIND_DAY: $('#affairEdit [data-type="remindDay"]'),
  EDIT_SUBMIT: $('#affairEdit button[type="button"]'),
  EDIT_BEGIN_TIME: $('#affairEdit [name="beginTime"]'),
  EDIT_END_TIME: $('#affairEdit [name="endTime"]')
};

function init_table() {
  selector.AFFAIR_CONTAINER.css("width", "100%").html(
    "<thead><tr></tr></thead><tbody></tbody>"
  );
  let columns = [];
  let data = [
    {
      name: "beginTime",
      text: "起始日期",
      render: (dom, type, row, grid) => {
        let mDate = moment(dom);
        return mDate.format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      name: "endTime",
      text: "结束日期",
      render: (dom, type, row, grid) => {
        if (dom === "") {
          return "（手动结束）";
        } else {
          let mDate = moment(dom);

          return mDate.format("YYYY-MM-DD HH:mm:ss");
        }
      }
    },
    {
      name: "type",
      text: "提醒类型",
      render: (dom, type, row, grid) => {
        switch (dom) {
          case "2":
            dom = "按日提醒";
            break;
          case "3":
            dom = "按周提醒";
            break;
          case "4":
            dom = "按月提醒";
            break;
          case "5":
            dom = "按年提醒";
            break;
        }
        return dom;
      }
    },
    { name: "remindDate", text: "提醒日期" },
    { name: "remindTime", text: "提醒时间" },
    { name: "content", text: "事务内容" }
  ];
  let events = [{ beginTime: "2018-01-22", endTime: "2018-02-22", type: "2", remindDate: "2018-01-21", remindTime: "13:00", content: "一些内容" }, { beginTime: "2018-01-22", endTime: "2018-02-22", type: "2", remindDate: "2018-01-21", remindTime: "13:00", content: "一些内容" }, { beginTime: "2018-01-22", endTime: "2018-02-22", type: "2", remindDate: "2018-01-21", remindTime: "13:00", content: "一些内容" }, { beginTime: "2018-01-22", endTime: "2018-02-22", type: "2", remindDate: "2018-01-21", remindTime: "13:00", content: "一些内容" }];

  for (let i = 0; i < data.length; i++) {
    selector.AFFAIR_CONTAINER.find("thead tr").append(
      "<td>" + data[i].text + "</td>"
    );
    columns.push({
      data: data[i].name,
      render: data[i].render
    });
  }
  selector.AFFAIR_CONTAINER.find("thead tr").append("<td></td>");

  console.log(columns);
  let set = {
    dtoClass: "oa.core.data.PageQueryParam",
    pageSize: 10,
    pageIndex: 0,
    nameStr:
      "seqId,beginTime,endTime,type,remindDate,remindTime,content,managerId,userId",
    sortColumn: "",
    direct: "asc"
  };
   selector.AFFAIR_CONTAINER.DataTable({
        destroy: true,
        searching: false,
        bLengthChange: false,
        async: false,
        data: events,
        columns

   });
  // var table = selector.AFFAIR_CONTAINER.on('preXhr.dt', function (e, setting, data) {

  //     setting.ajax.data = set;
  // }).DataTable({
  //     destroy: true,
  //     searching: false,
  //     bLengthChange: false,
  //     serverSide: true,
  //     async: false,
  //     rowCallback: function (row, data, dataIndex) {
  //         $(row).attr({
  //             'data-id': data.seqId,
  //             'data-action': 'readAffair'
  //         });
  //     },
  //     columns,
  //     ajax: {
  //         url: "/oa/oa/core/funcs/calendar/act/AffairAct/selectAffairByPagin.act",
  //         data: {},
  //         dataType: 'json',
  //         type: 'post',
  //         dataSrc: function (result) {
  //             console.log(result);

  //             result.recordsTotal = result.totalRecord;
  //             result.recordsFiltered = result.totalRecord;
  //             return result.pageData;
  //         }
  //     }
  // });
  // //监听页数变化，改变传给后台的参数
  // selector.AFFAIR_CONTAINER.on('page.dt', function () {
  //     console.log(this === table);
  //     var info = table.page.info();
  //     set.pageIndex = info.page;

  // });
}
init_table();
