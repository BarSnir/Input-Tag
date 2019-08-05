export class StringUtil {
    replaceComma(expression){
        var find = ',';
        var re = new RegExp(find, 'g');
        return expression.replace(re,''); 
    }
}