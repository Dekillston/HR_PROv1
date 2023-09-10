const { google } = require("googleapis");
//
var PathFiles = './files/';
//
const fs = require('fs');
// Главные переменные
var operator = ['411709306', true, false, {}];
//
var google_sheets = 'google_sheets.json';
//
var SeconsOperator = 60; // Сколько в секунда нельзя просить оператора 
//
// Временные данные 
var base = [];
//
var SendText;  
//
var BanUsers = [];
//
var num = 0;
//
// Функции очистки
Clean();
function Clean() {
	var seconds = new Date().getTime() / 1000; 
	//
	// Удаляет секунды проверить текст на русские символы js
	for(var n = 0; n <= base.length-1; n++) {
		// Блок удаления
		if(base[n].second < seconds) {
			delete base[n].second;
		}
		if(base[n].second_resume < seconds) {
			delete base[n].resume; delete base[n].second_resume;
		}
		// Блок очистки
		if(Object.keys(base[n]).length == 1 && base[n].id !== undefined) {
			base.splice(n, 1);
		}
	}
	//
	setTimeout(Clean, 10000);
}
//
AddTextGoogle();
function AddTextGoogle() {
	GoogleSheetsConnect({
		fileJson: google_sheets,
		crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
		page: 'send_text!A:A',
		newData: [],
		fun: (d) => {
			SendText = d;
		}
	});
	//
	setTimeout(AddTextGoogle, 60000);
}
//
BanUsersGoogle();
function BanUsersGoogle() {
	GoogleSheetsConnect({
		fileJson: google_sheets,
		crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
		page: 'visit',
		newData: [],
		fun: (d) => {
			var dt = [];
			for(var n = 0; n <= d.length-1; n++) {
				for(var n1 = 0; n1 <= d[n].length-1; n1++) {
					if(d[n][n1].toLowerCase() == 'закрытый') {
						dt.push(d[n][0]);
					}
				}
			}
			BanUsers = dt;
		}
	});
	//
	setTimeout(BanUsersGoogle, 10000);
}
//
function ResumeСheck(id, funct) {
	GoogleSheetsConnect({
		fileJson: google_sheets,
		crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
		page: 'interns!B:B',
		newData: [],
		fun: (d) => {
			for(var n = 0; n <= d.length-1; n++) {
				if(id == d[n]) {
					funct(false);
					return;
				}
			}
			funct(true);
			return;
		}
	});
}
//
setTimeout(MessagesWorks, 5000);
function MessagesWorks() {
	GoogleSheetsConnect({
		fileJson: google_sheets,
		crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
		page: 'workers',
		newData: [],
		fun: (w) => {
			CSVworkersFile(w);
			//
			var d = [];
			for(var n = 1; n <= w.length-1; n++) {  
				if(w[n].length >= 8) {
					d.push(w[n][0]);
				}
			}
			d = (Array.from(new Set(d)));
			//
			GoogleSheetsConnect({
				fileJson: google_sheets,
				crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k', 
				page: 'messages!A:A', 
				newData: [],
				fun: (m) => {
					var y = [];
					//
					for(var n = 0; n <= d.length-1; n++) {
						var bool = true;
						for(var b = 0; b <= m.length-1; b++) {
							if(d[n] == m[b][0]) {
								bool = false; 
							}
						}
						if(bool) {
							y.push(d[n]); 
						}
					}
					//
					var data = []; 
					for(var n = 0; n <= y.length-1; n++) {
						ButtonMassage(y[n], SendText[44][0], [[SendText[45][0], '/data_works'], [SendText[21][0], '/call_admin']]);
						//
						data.push([y[n]]);
					}
					//
					GoogleSheetsConnect({
						fileJson: google_sheets,
						crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k', 
						page: 'messages!A:A', 
						newData: data,
						fun: (m) => {} 
					});
				}
			});
		}
	});
	//
	setTimeout(MessagesWorks, 60000);
}
//
//
//
//
var bot = new (require('node-telegram-bot-api'))('5616050607:AAE8CNaCM9EP2-LknspJKdS4MkDhNoxYRCI', {polling: true});
bot.on('message', msg => {OnMessage(msg)});
//
bot.setMyCommands([]);
//
//
function OnMessage(msg) { // Обработка входящих сообщений 
	//
	if(BanCheck(msg.chat.id)) {return} // Бан  
	//
	// Перехват сообщений для общения
	if(operator[2]) {
		if(msg.chat.id == operator[0]) {
			SimulationMessage(operator[1], msg); 
			//
			return;
		} else if(msg.chat.id == operator[1]) {
			SimulationMessage(operator[0], msg);
			//
			return;
		}
	}
	//
	if(msg.chat.id == operator[0]) {MassageOperator(msg); return;}
	//
	// Перехват сообщения для резюме
	if(!(msg.chat.id == operator[0])) {
		if(!(BaseKeysReading(msg.chat.id, 'resume'))) {
			//
			BaseKeysRecord(msg.chat.id, (n) => {
				ResumeOpen(msg.chat.id, base[n]['resume'], msg.text);
			}); 
			//
			return;
		}
	} 
	//
	// Старт
	if(msg.text == '/start') { 
		ButtonMassage(msg.chat.id, SendText[0][0], [[SendText[20][0], '/further_start']]);
		//
		GoogleSheetsConnect({
			fileJson: google_sheets,
			crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
			page: 'visit!A:A',
			newData: [],
			fun: (d) => {
				for(var n = 0; n <= d.length-1; n++) { 
					if(msg.chat.id == d[n]) {
						return;
					}
				}
				//
				GoogleSheetsConnect({ 
					fileJson: google_sheets,
					crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
					page: 'visit',
					newData: [[msg.chat.id , ExactDate('.', '-', ':'), msg.from.first_name, 'Открытый']],
					fun: (d) => {}
				});
			}
		});
	}
}
//
// Нажатие кнопок
bot.on('callback_query', msg => {
	if(BanCheck(msg.message.chat.id)) {return} // Бан
	//
	if(operator[0] == msg.message.chat.id) {OperatorCode(msg); return;}
	//
	if(msg.message.chat.id == operator[1] && operator[2]) {return};
	//
	var CallAdmin = [SendText[21][0], '/call_admin'];
	//
	// Старт
	if(msg.data == '/further_start') {
		ButtonMassage(msg.message.chat.id, SendText[1][0], [
			[SendText[22][0], '/own_resources'],
			[SendText[23][0], '/our_resources'],
			CallAdmin
		]);
	}
	//
	// Ресурсы
	var YS = [[SendText[24][0], '/index_food'],[SendText[25][0], '/scooter']];
	//
	if(msg.data == '/own_resources') { // Свои ресурсы
		ButtonMassage(msg.message.chat.id, SendText[2][0], YS);
	} else if(msg.data == '/our_resources') { // Чужие ресурсы
		ButtonMassage(msg.message.chat.id, SendText[6][0], YS);
	}
	//
	// Если нажал куда он хочет работать
	var work = [[SendText[26][0], '/get_access'], CallAdmin];
	if(msg.data == '/index_food') { // Яндекс еда
		ButtonMassage(msg.message.chat.id, SendText[3][0], work);
	} else if(msg.data == '/scooter') { // Самокат
		ButtonMassage(msg.message.chat.id, SendText[5][0], work);
	}
	//
	// Спрашивает вы точно хотите вписать резюме
	if(msg.data == '/get_access') {
		ButtonMassage(msg.message.chat.id, SendText[4][0], [
			[SendText[27][0], '/write_resume']
		]);
	}
	//
	// Связь с оператором
	if(msg.data == '/call_admin_connect') {
		if(!(BaseKeysReading(msg.message.chat.id, 'resume'))) {
			BaseKeysRecord(msg.message.chat.id, (n) => {
				delete base[n].resume;
			}); 
		}
		//
		if(msg.message.chat.id == operator[1]) { 
			bot.sendMessage(msg.message.chat.id, SendText[8][0]);
			//
			var TC = (SendText[9][0]).split('*'); TC = (TC[0]+(msg.from.first_name+'('+msg.message.chat.id+')')+TC[2]);
			bot.sendMessage(operator[0], TC);
			//
			operator[2] = true; 
		} else {
			bot.sendMessage(msg.message.chat.id, SendText[10][0]);
		}
	} else if(msg.data == '/call_admin') {
		if(msg.message.chat.id == operator[1]) {
			bot.sendMessage(msg.message.chat.id, SendText[11][0]);
			//
			return;
		} else {
			if(BaseKeysReading(msg.message.chat.id, 'second')) { 
				if(operator[1] == true) {
					bot.sendMessage(msg.message.chat.id, SendText[7][0]);
					//
					var TC = (SendText[12][0]).split('*'); TC = (TC[0]+(msg.from.first_name+'('+msg.message.chat.id+')')+TC[2]);
					ButtonMassage(operator[0], TC, [['Принять', '/connectId_'+msg.message.chat.id]]);
					//
					BaseKeysRecord(msg.message.chat.id, (n) => {
						base[n]['second'] = ((new Date().getTime() / 1000)+SeconsOperator);
					}); 
				} else {
					bot.sendMessage(msg.message.chat.id, SendText[18][0]);
				}
			} else { 
				bot.sendMessage(msg.message.chat.id, SendText[19][0]);
			}
		}
	}
	//
	// Вписывание резюме
	if(msg.data == '/write_resume') {
		ResumeСheck(msg.message.chat.id, (b) => {
			if(b) {
				BaseKeysRecord(msg.message.chat.id, (n) => {
					base[n]['resume'] = {full_name: true, city: true, mail: true, phone: true, cooperation: true};
					base[n]['second_resume'] = ((new Date().getTime() / 1000)+600);
					//
					bot.sendMessage(msg.message.chat.id, SendText[28][0]);
				});
			} else {
				ButtonMassage(msg.message.chat.id, SendText[43][0], [[SendText[21][0], '/call_admin']]);
			}
		}) 
	} else if(TextSimi('/resources_resume', msg.data)) {
		if(!(BaseKeysReading(msg.message.chat.id, 'resume'))) {
			//
			BaseKeysRecord(msg.message.chat.id, (n) => {
				if(base[n]['resume'].cooperation !== true) {
					bot.sendMessage(msg.message.chat.id, SendText[29][0]);
				}
				if(base[n]['resume'].phone == true) { 
					ButtonMassage(msg.message.chat.id, SendText[30][0], [[SendText[27][0], '/write_resume']]);
				} else {
					if(msg.data == '/resources_resume_i') {
						base[n]['resume'].cooperation = SendText[22][0];
					} else if(msg.data == '/resources_resume_o') {
						base[n]['resume'].cooperation = SendText[23][0];
					}
					//
					ButtonMassage(msg.message.chat.id,  SendText[31][0], [[SendText[41][0], '/sdid'], [SendText[42][0], '/write_resume']]);
				}
			}); 
			//
			return;
		}
	} else if(msg.data == '/sdid') {
		if(!(BaseKeysReading(msg.message.chat.id, 'resume'))) {
			BaseKeysRecord(msg.message.chat.id, (n) => {
				var bool = true;
				//
				var r = base[n].resume;
				//
				var keys = Object.keys(r);
				//
				for(var n = 0; n <= keys.length-1; n++) {
					if(r[keys[n]] == true) {
						bool = false;
					}
				}
				//
				if(bool) {
					GoogleSheetsConnect({
						fileJson: google_sheets,
						crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
						page: 'interns',
						newData: [[
							(ExactDate('.', '-', ':')),
							msg.message.chat.id,
							r.full_name,
							r.city,
							r.mail,
							r.phone, 
							r.cooperation
						]],
						fun: (d) => {
							bot.sendMessage(msg.message.chat.id, SendText[54][0]);
							//
							BaseKeysRecord(msg.message.chat.id, (n) => {delete base[n].resume;}); 
						}
					});
					//
				} else {
					ButtonMassage(msg.message.chat.id, SendText[32][0], [[SendText[27][0], '/write_resume']]);
				}
			}); 
		}
	}
	if(msg.data == '/data_works') {
		if (fs.existsSync(PathFiles+msg.message.chat.id+'.csv')) {
			bot.sendDocument(msg.message.chat.id, PathFiles+msg.message.chat.id+'.csv');
		}
	}
});
//
//
// Оператор
function OperatorCode(msg) {
	// Начать переписку
	if(TextSimi('/connectId', msg.data)) {
		operator[3] = {};
		//
		var stop = ['Сбросить', '/stop'];
		//
		if(operator[1] == true) {
			ButtonMassage(msg.message.chat.id, SendText[13][0], [stop]);
			//
			operator[1] = (msg.data.split('_'))[1];
			//
			ButtonMassage(operator[1], SendText[14][0], [['Принять', '/call_admin_connect']]);
			//
			return;
		}
		//
		ButtonMassage(msg.message.chat.id, SendText[15][0], [stop]);
	} else if(msg.data == '/stop') {
		bot.sendMessage(operator[0], SendText[16][0]);
		//
		bot.sendMessage(operator[1], SendText[17][0]);
		//
		operator[1] = true;
		//
		operator[2] = false;
	} else if(msg.data == '/mailing_works') {
		operator[3] = {};
		operator[3].works = true;
		//
		bot.sendMessage(operator[0], SendText[48][0]);
	} else if(msg.data == '/mailing_not_works') {
		operator[3] = {};
		operator[3].noworks = true;
		//
		bot.sendMessage(operator[0], SendText[48][0]);
	} else if(msg.data == '/send_milling') {
		if(operator[3].works && operator[3].works !== true) {
			GoogleSheetsConnect({
				fileJson: google_sheets,
				crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
				page: 'messages!A:A',
				newData: [],
				fun: (d) => {
					for(var n = 1; n <= d.length-1; n++) {
						SimulationMessage(d[n][0], operator[3].works); 
					}
					//
					operator[3] = {};
					//
					bot.sendMessage(operator[0], SendText[51][0]+'\n('+SendText[49][0]+')');
				}
			});
		} else if(operator[3].noworks && operator[3].noworks !== true) {
			GoogleSheetsConnect({
				fileJson: google_sheets,
				crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
				page: 'visit',
				newData: [],
				fun: (visit) => {
					GoogleSheetsConnect({
						fileJson: google_sheets,
						crsId: '1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k',
						page: 'messages!A:A', 
						newData: [],
						fun: (messages) => {
							for(var v = 1; v <= visit.length-1; v++) {
								if(visit[v][3] == 'Открытый') {
									var bool = true;
									for(var m = 0; m <= messages.length-1; m++) {
										if(visit[v][0] == messages[m][0]) {
											bool = false;
										}
									}
									if(bool) {
										SimulationMessage(visit[v][0], operator[3].noworks); 
									}
								}
							}
							//
							operator[3] = {};
							//
							bot.sendMessage(operator[0], SendText[51][0]+'\n('+SendText[50][0]+')');
						}
					});
				}
			});
		}
	}
}
//
//
function ResumeOpen(id, resume, text) {
	// Проверка фио
	if(resume.full_name == true) {
		var full_name = ((text.replace(/^\s+|\s+$/g, '')).replace(/\s{2,}/g, ' ').split(' '));
		//
		if(full_name.length == 3 && (full_name.join('')).length < 100) {
			resume.full_name = full_name.join(' ');
			//
			bot.sendMessage(id, SendText[33][0]);
		} else {
			bot.sendMessage(id, SendText[34][0]);
		}
	} else if(resume.city == true) {
		var city = ((text.replace(/^\s+|\s+$/g, '')).replace(/\s{2,}/g, ' ').split(' '));
		//
		if(city[0].length > 1 && (city.join('')).length < 100) {
			resume.city = city.join(' ');
			//
			bot.sendMessage(id, SendText[35][0]);
		} else {
			bot.sendMessage(id, SendText[36][0]);
		}
	} else if(resume.mail == true) {
		var mail = ((text.replace(/^\s+|\s+$/g, '')).replace(/\s{2,}/g, ' ').split(' '));
		//
		if(mail.length == 1 && TextSimi('@', mail[0]) && MailRusFalse(mail[0])) {
			resume.mail = mail.join(' ');
			//
			bot.sendMessage(id, SendText[37][0]);
		} else {
			bot.sendMessage(id, SendText[38][0]);
		}
	} else if(resume.phone == true) {
		var phone = ((text.replace(/^\s+|\s+$/g, '')).replace(/\s{2,}/g, ' ').split(' '));
		//
		var phoneTrue = PhoneTrue(phone[0]);
		//
		if(phone.length == 1 && phoneTrue !== false) {
			resume.phone = phoneTrue;
			//
			ButtonMassage(id, SendText[39][0], [
				[SendText[22][0], '/resources_resume_i'],
			 	[SendText[23][0], '/resources_resume_o']
			]);
		} else {
			bot.sendMessage(id, SendText[40][0]);   
		}
	}
}
//
function MassageOperator(msg) {
	//
	if(operator[3].works == true) {
		operator[3].works = msg;
		//
		ButtonMassage(operator[0], SendText[52][0], [['Отправить', '/send_milling'], [SendText[50][0], '/mailing_not_works']]);
	} else if(operator[3].noworks == true) {
		operator[3].noworks = msg;
		//
		ButtonMassage(operator[0], SendText[52][0], [['Отправить', '/send_milling'], [SendText[49][0], '/mailing_works']]);
	}
	if(msg.text == '/start') {
		bot.sendMessage(msg.chat.id, SendText[46][0]);
	} else if(msg.text == '/help') {
		ButtonMassage(msg.chat.id, SendText[55][0], [
			[SendText[53][0], '/stop'], 
			[SendText[49][0], '/mailing_works'],
			[SendText[50][0], '/mailing_not_works']
		]);
	}
}











// https://docs.google.com/spreadsheets/u/4/d/1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k/export?format=csv&id=1DF4pvYB-4M82NmImHQ93SyVcikNp8zjtu4hFgeNwf0k&gid=1845850837
//
// git remote add origin https://github.com/Dekillston/HR_PROv1.git
//
// Функции
//
//
function CSVworkersFile(data) {
	var IdMass = {};
	//
	var CellName = data[0].join(';')+'\r\n';
	//
	for(var n = 1; n <= data.length-1; n++) {
		var DataText = (data[n].join(';')+'\r\n');
		//
		if(IdMass[data[n][0]] !== undefined) {
			IdMass[data[n][0]]+=DataText;
		} else {
			IdMass[data[n][0]] = DataText;
		}
	} 
	//
	var keys = Object.keys(IdMass);
	//
	CreateFile(0, IdMass, keys, PathFiles, CellName);
	function CreateFile(num, IdMass, keys, PathFiles, CellName) {
		fs.writeFile(PathFiles+keys[num]+'.csv',  ('\uFEFF'+CellName+IdMass[keys[num]]), 'utf8', (err) => { 
			if(num < keys.length-1) {
				CreateFile(num+1, IdMass, keys, PathFiles, CellName);
			}
		});
	}
}
//
function BaseKeysRecord(id, fun) {
	for(var n = 0; n <= base.length-1; n++) {
		if(base[n].id == id) {
			fun(n);
			//
			return;
		}
	}
	base.push({id: id});
	fun(base.length-1);
}
//
function BaseKeysReading(id, key) {
	for(var n = 0; n <= base.length-1; n++) {
		if(base[n].id == id) {
			if(base[n][key] !== undefined) {
				return false;
			}
		}
	}
	//
	return true;
}
//
function SimulationMessage(id, file) {
	if(file.photo) { // Фотки
		bot.sendPhoto(id, file.photo[0].file_id);
	} else if(file.voice ) { // Голосовые
		bot.sendVoice(id, file.voice.file_id);
	} else if(file.document) {
		bot.sendDocument(id, file.document.file_id);
	}
	//
	if(file.caption) {bot.sendMessage(id, file.caption);};
	//
	if(file.text) {bot.sendMessage(id, file.text);} // Обычный текст
}
//
function SetMyCommands(m) { // Функцию меню
	var mass = [];
	for(var n = 0; n <= m.length-1; n++) {
		mass.push({command: '/'+(m[n][0]), description: m[n][1]});
	}
	bot.setMyCommands(mass);
}
//
function ButtonMassage(id, text, m) { // Создание кнопок
	var button = [];
	for(var n = 0; n <= m.length-1; n++) {
		button.push([{text: m[n][0], callback_data: m[n][1]}]);
	}
	//
	var ButtonMassage = {reply_markup: JSON.stringify({inline_keyboard: button})};
    bot.sendMessage(id, text, ButtonMassage);
}
//
function TextSimi(str1, str2) { // Найти текст
     if((str2.toUpperCase()).indexOf(str1.toUpperCase()) >= 0) {
        return true;
    } else {
        return false;
    }
}
//
function GoogleSheetsConnect(data) {
	const auth = new google.auth.GoogleAuth({
		keyFile: data.fileJson,
		scopes: "https://www.googleapis.com/auth/spreadsheets",
	});
	//
	(async () => {
		const client = await auth.getClient();
		//
		const googleSheets = google.sheets({ version: "v4", auth: client });
		//
		const spreadsheetId = data.crsId;
		//
		const metaData = await googleSheets.spreadsheets.get({
			auth,
			spreadsheetId,
		});
		//
		if(data.newData.length > 0) {
			await googleSheets.spreadsheets.values.append({
			    auth,
			    spreadsheetId,
			    range: data.page,
			    valueInputOption: "USER_ENTERED",
			    resource: {
			      values: data.newData,
			    },
	  		});
	  		//
	  		data.fun();
			return;
		}
		//
		const getRows = await googleSheets.spreadsheets.values.get({
		    auth,
		    spreadsheetId,
		    range: data.page
		});
		//
		data.fun(getRows.data.values);
	})();
}
//
function PhoneTrue(phone) {
	phone = phone.replace(/\s/g, "");
	//
	var p = '';
	for(var n = 0; n <= phone.length-1; n++) {
		if(!isNaN(Number(phone[n]))) {
			p+=phone[n];
		}
	}
	//
	if(p.length == 10) {
		p = '8'+p;
	}
	//
	if(p.length == 11) {
		return p;
	} else {
		return false;
	}
}
//
function MailRusFalse(mail) {
	if(mail.length > 150) {return false};
	//
	for(var n = 0; n <= mail.length-1; n++) { 
		if((/^[а-яА-ЯёЁ\s]+$/).test(mail[n])) {
			return false
		}
	}
	return true;
}
//
function ExactDate(str1, str2, str3) {
	let data = new Date();
	//
	return (
		String(data.getDate()).padStart(2, '0')
		+str1+
		String((data.getMonth()+1)).padStart(2, '0')
		+str1+
		String(data.getFullYear()).padStart(2, '0')
		+str2+
		String(data.getHours()).padStart(2, '0')
		+str3+
		String(data.getMinutes()).padStart(2, '0')
		+str3+
		String(data.getSeconds()).padStart(2, '0')
	);
}
//
function BanCheck(id) {
	for(var n = 0; n <= BanUsers.length-1; n++) {
		if(id == BanUsers[n]) {
			return true;
		}
	}
	return false;
}
// Ипользуемые библиотеки
// git pull в папке. Обновить содержимое
/*
googleapis
*/
