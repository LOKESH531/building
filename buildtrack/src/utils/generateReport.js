import jsPDF from "jspdf";


function generateReport(project,material,expense,updates){


const pdf=new jsPDF();



pdf.setFontSize(20);

pdf.text(
"BuildTrack Project Report",
20,
20
);



pdf.setFontSize(12);



pdf.text(

`Project Name: ${project.name}`,

20,

40

);



pdf.text(

`Client: ${project.client}`,

20,

50

);



pdf.text(

`Location: ${project.location}`,

20,

60

);



pdf.text(

`Status: ${project.status}`,

20,

70

);



pdf.text(

`Progress: ${project.progress}%`,

20,

80

);



pdf.text(

`Budget: Rs.${project.budget}`,

20,

100

);



pdf.text(

`Material Cost: Rs.${material}`,

20,

110

);



pdf.text(

`Expense Cost: Rs.${expense}`,

20,

120

);



pdf.text(

`Remaining: Rs.${project.budget-expense}`,

20,

130

);



pdf.text(

"Daily Updates",

20,

155

);



let y=170;



updates.forEach(u=>{


pdf.text(

`${u.date} - ${u.workDone}`,

20,

y

);



y+=10;


});



pdf.save(

`${project.name}_Report.pdf`

);



}



export default generateReport;
