import axios from 'axios';
import { Request, Response } from 'express';
import knex from '../../database/db';

const url = 'https://viacep.com.br/ws/';

export async function consultaCep(req: Request, res: Response) {
    try{ 
        if(req.params.cep.length == 8){
            const select:any = await knex('cep').select('cep').where('cep', `${req.params.cep}`)
            if(!select[0]){
                const response:any = await axios.get(`${url}${req.params.cep}/json/`)
                .catch((e)=> {console.log(e)});
                console.log(response.data.erro)
                if(!response.data.erro){
                    console.log("descobrir")
                    const cep = response.data.cep.replace("-", "");
                    await knex('cep').insert({cep: cep, localidade: response.data.localidade, uf: response.data.uf, ibge: response.data.ibge, ddd: response.data.ddd, siafi: response.data.siafi, logradouro: response.data.logradouro, complemento: response.data.complemento, bairro: response.data.bairro, gia: response.data.gia})
 
                    return res.status(200).json(response.data)
                }else{
                    return res.status(400).json({message: "esse CEP não existe."})
                }
            }else{
                const completeCep = await knex('cep').select('*').where('cep', `${req.params.cep}`);
                const formatedCep = completeCep[0].cep.toString();
                completeCep[0].cep = formatedCep.slice(0,5) + '-' + formatedCep.slice(5,8)
                return res.status(200).json(completeCep)
            }
        }else{
            return res.status(400).json({message: "quantidade de caracteres inválidos"})
        }
    }catch(e){
        console.log(e)
        return res.status(400).send(e)
    }
}
