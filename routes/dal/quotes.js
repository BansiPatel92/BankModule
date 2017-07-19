var method = quotes.prototype;

function quotes() {
    this.loanTypeId = 0;
    this.quoteId = 0;
    this.quote = "";
    this.index = 0;
    this.questionId = 0;
    this.questionText = "";
    this.questionDisplayText = "";
    this.questionLabel = "";
    this.optionId = 0;
    this.optionTitle = "";
    this.optionType = "";
    this.optionUnit = "";
    this.childOptionId = 0;
    this.childOptionType = "";
    this.childOptionKey = "";
    this.childOptionValue = "";
    this.isRequired = 0;
    this.options = [];
    this.nextSteps = [];
}
function childoption() {
    this.childOptionId = 0;
    this.childOptionType = "";
    this.childOptionUnit = "";
    this.childOptionKey = "";
    this.childOptionValue = "";
    this.isDefault = "";
}

function nextstep() {
    this.nextStepId = 0;
    this.quotesStepsId = 0;
    this.strAnswer = "";
    this.strCondition = "";
    this.nextQuotesStepsId = 0;
    this.questionId = 0;
    this.NextQuestionId = 0;
}

method.getQuotesByLoanType = function (data, fn) {
    try {
        var cnn = require('./db');

        var prep = cnn.prepare('select int_loantype_id,int_id,str_quote_name from tbl_loan_quotes where int_loantype_id = :loanTypeId and bit_is_active = 1 order by str_quote_name asc,int_loantype_id');// where int_loantype_id = :loanTypeId
        cnn.query(prep(data), function (err, rows) {
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var quotesList = [];

                for (i = 0; i < rows.length; i++) {
                    var quote = new quotes();
                    quote.loanTypeId = rows[i].int_loantype_id;
                    quote.quoteId = rows[i].int_id;
                    quote.quote = rows[i].str_quote_name;

                    quotesList.push(quote);
                }
                fn(null, quotesList);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}

method.getQuestionsByQuoteId = function (data, fn) {
    try {
        var cnn = require('./db');
        var dbquery = 'SELECT QM.int_id AS QuestionId,QM.str_question_text AS QuestionText,QM.str_question_display_text AS QuestionDisplayText,QM.str_question_label AS QuestionLabel,QM.bln_is_required AS IsRequired,O.int_id OptionId,O.str_option_title OptionTitle,O.int_option_type_id OptionType,O.str_option_unit Unit ' +
            'FROM tbl_quotes_steps QS inner join tbl_question_master QM on QM.int_id = QS.int_question_id inner join tbl_options O on O.int_question_master_id = QM.int_id WHERE QS.int_loan_quotes_id = ' + data.quoteId + ' ; ' +
            'SELECT QM.int_id AS QuestionId,O.int_id OptionId,CASE WHEN OC.int_id IS NULL Then 0 ELSE OC.int_id END AS ChildOptionId,OC.int_option_type_id ChildOptionType,OC.str_option_key ChildOptionKey,OC.str_option_value ChildOptionValue,OC.str_option_unit ChildOptionUnit,OC.bln_is_default IsDefault ' +
            'FROM tbl_quotes_steps QS inner join tbl_question_master QM on QM.int_id = QS.int_question_id inner join tbl_options O on O.int_question_master_id = QM.int_id inner join tbl_option_children OC on OC.bln_is_active = 1 and OC.int_option_id = O.int_id WHERE QS.int_loan_quotes_id = ' + data.quoteId +
            ' Order By OC.str_option_key; SELECT QNS.int_id Id, QNS.int_quotes_steps_id QuotesStepsId, QNS.str_answer StrAnswer, QNS.str_condition StrCondition, QNS.int_next_quotes_steps_id NextQuotesStepsId, QS.int_question_id QuestionId, QSS.int_question_id NextQuestionId ' +
            'From tbl_quotes_next_steps QNS inner join tbl_quotes_steps QS on QS.int_id = QNS.int_quotes_steps_id left join tbl_quotes_steps QSS on QSS.int_id = QNS.int_next_quotes_steps_id Where  QS.int_loan_quotes_id = ' + data.quoteId;

        var prep = cnn.prepare(dbquery);
        cnn.query(prep(), function (err, rows) {
            
            if (err) {
                console.log(err);
                fn(err, null);
            }
            else {
                var quotesList = [];
                for (i = 0; i < rows[0].length; i++) {
                    var quote = new quotes();
                    quote.index = i + 1;
                    quote.questionId = rows[0][i].QuestionId;
                    quote.questionText = rows[0][i].QuestionText;
                    quote.questionDisplayText = rows[0][i].QuestionDisplayText;
                    quote.questionLabel = rows[0][i].QuestionLabel;
                    quote.optionId = rows[0][i].OptionId;
                    quote.optionTitle = rows[0][i].OptionTitle;
                    quote.optionType = rows[0][i].OptionType;
                    quote.isRequired = rows[0][i].IsRequired;
                    quote.optionUnit = rows[0][i].Unit;
                    for (var j = 0; j < rows[1].length; j++) {
                        if (rows[1][j].QuestionId === rows[0][i].QuestionId) {
                            var option = new childoption();
                            option.childOptionId = rows[1][j].ChildOptionId;
                            option.childOptionType = rows[1][j].ChildOptionType;
                            option.childOptionUnit = rows[1][j].ChildOptionUnit;
                            option.childOptionKey = rows[1][j].ChildOptionKey;
                            option.childOptionValue = rows[1][j].ChildOptionValue;
                            option.isDefault = rows[1][j].IsDefault;
                            quote.options.push(option);
                        }
                    }
                    for (var k = 0; k < rows[2].length; k++) {
                        if (rows[2][k].QuestionId === rows[0][i].QuestionId) {
                            var step = new nextstep();
                            step.nextStepId = rows[2][k].NextStepId;
                            step.quotesStepsId = rows[2][k].QuotesStepsId;
                            step.strAnswer = rows[2][k].StrAnswer;
                            step.strCondition = rows[2][k].StrCondition;
                            step.nextQuotesStepsId = rows[2][k].NextQuotesStepsId;
                            step.questionId = rows[2][k].QuestionId;
                            step.nextQuestionId = rows[2][k].NextQuestionId;
                            quote.nextSteps.push(step);
                        }
                    }
                    quotesList.push(quote);
                }
                fn(null, quotesList);
            }
        });
    } catch (err) {
        console.log(err);
        fn(err, null);
    }
}


module.exports = quotes;


