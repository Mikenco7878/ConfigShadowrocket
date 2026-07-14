var obj = JSON.parse($response.body);

obj.role = 2;
obj.sync = "2027-02-28T06:31:27.761Z";
obj.noAdDate = "2099-09-09T19:40:44.053Z";
obj.noAdDate_Adult = "2099-09-09T19:40:44.053Z";
obj.freeTime = 0;

$done({body: JSON.stringify(obj)}); 