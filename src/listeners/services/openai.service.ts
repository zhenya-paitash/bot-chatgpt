import { createReadStream } from 'node:fs'
import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionResponseMessage } from 'openai'
import FormData from 'form-data'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { configService } from '../../config/config.service.js'

export class OpenAIService {
  private configuration: Configuration
  private openai: OpenAIApi

  /**
   * This is a constructor function that initializes an instance of the OpenAIApi
   * class with a given API key.
   * @param {string} apiKey - The `apiKey` parameter is a string that represents
   * the API key used to authenticate and authorize access to the OpenAI API. This
   * key is required to make requests to the OpenAI API and should be kept secure
   * and confidential.
   */
  constructor(apiKey: string) {
    this.configuration = new Configuration({ apiKey })
    this.openai = new OpenAIApi(this.configuration)
  }

  /**
   * This is an async function that uses OpenAI to create a chat completion
   * response message based on the input messages.
   * @param {ChatCompletionRequestMessage[]} messages - An array of
   * ChatCompletionRequestMessage objects, which contain the text of the messages
   * exchanged between the user and the chatbot. These messages are used as context
   * for the OpenAI model to generate a response.
   * @returns The function `chat` returns a Promise that resolves to a
   * `ChatCompletionResponseMessage` object.
   */
  async chat(messages: ChatCompletionRequestMessage[]): Promise<ChatCompletionResponseMessage> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      })
      const responseMessage: ChatCompletionResponseMessage | undefined = response.data.choices[0].message
      if (!responseMessage) {
        throw new Error('Нет ответа')
      }
      return responseMessage
    } catch (e: Error | any) {
      const error = `OpenAI transcription error: ${e?.message}`
      throw new Error(error)
    }
  }

  /**
   * This is an asynchronous function that transcribes a file using OpenAI and
   * returns the text.
   * @param {string} filepath - A string representing the file path of the audio
   * file that needs to be transcribed.
   * @returns a Promise that resolves to a string, which is the text transcription
   * of the audio file located at the filepath provided as an argument to the
   * function.
   */
  async transcription(filepath: string): Promise<string> {
    try {
      const response = await this.customCreateTranscription(filepath)
      return response.data.text
    } catch (e: Error | any) {
      const error = `OpenAI transcription error: ${e?.message}`
      throw new Error(error)
    }
  }

  /**
   * This is an async function that creates a transcription using OpenAI's API by
   * sending an audio file and a model name as form data.
   * @param {string} filepath - The file path of the audio file that needs to be
   * transcribed.
   * @returns an AxiosResponse object, which contains the response data from the
   * API call made in the function.
   */
  async customCreateTranscription(filepath: string): Promise<AxiosResponse> {
    try {
      const form: FormData = new FormData()
      form.append('file', createReadStream(filepath))
      form.append('model', 'whisper-1')
      const configuration: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.openai.com/v1/audio/transcriptions',
          headers: { 
          'Content-Type': 'multipart/form-data', 
          'Authorization': `Bearer ${configService.get('chatgpt.api.key')}`, 
          ...form.getHeaders()
        },
        data: form,
      }
      const response: AxiosResponse = await axios.request(configuration)
      return response
    } catch (e: AxiosError | Error | any) {
      console.log((<AxiosError>e).response?.data)
      throw new Error(e.message)
    }
  }
}

/* This line of code is exporting an instance of the `OpenAIService` class as a
constant variable named `openaiService`. The instance is created by calling the
`OpenAIService` constructor with the API key obtained from the `configService`
using the `get` method. This allows other modules to import and use the
`openaiService` instance to make requests to the OpenAI API. */
export const openaiService = new OpenAIService(configService.get('chatgpt.api.key'))