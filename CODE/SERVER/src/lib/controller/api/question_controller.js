// IMPORTS

import { questionService } from '../../service/question_service';

// -- FUNCTIONS

export async function getQuestionArray(
    request,
    reply
    )
{
    return reply.send(
        {
            questionArray : await questionService.getQuestionArray()
        }
        );
}

// ~~

export async function getQuestionArrayByPropertyId(
    request,
    reply
    )
{
    return reply.send(
        {
            questionArray : await questionService.getQuestionArrayByPropertyId( request.body.propertyId )
        }
        );
}

// ~~

export async function addQuestion(
    request,
    reply
    )
{
    return reply.send(
        {
            question : await questionService.addQuestion( request.body.question )
        }
        );
}

// ~~

export async function setQuestionById(
    request,
    reply
    )
{
    let question = request.body.question;

    return reply.send(
        {
            question : await questionService.updateQuestionById( question.id, request.body.question )
        }
        );
}
