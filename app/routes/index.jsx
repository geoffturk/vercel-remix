import { Form, useActionData, useLoaderData } from '@remix-run/react'
// import { json } from '@remix-run/vercel'

import fetchPost from '~/utils/fetchPost'
import generateForm from '~/utils/generateForm'
import generateInstance from '~/utils/generateInstance.server'
import parseRef from '~/utils/parseRef.server'

export async function action({ request }) {
  let formData = await request.formData()
  let rawData = {}
  for (let key in formData._fields) {
    formData._fields[key].length > 1
      ? (rawData[key] = formData._fields[key])
      : (rawData[key] = formData._fields[key][0])
  }
  let { _action, _url, ...data } = rawData
  if (_action === 'submit') {
    let schemaUrl = `https://test-cdn.murmurations.network/schemas/${data.linked_schemas}.json`
    let schema = await parseRef(schemaUrl)
    let profile = generateInstance(schema, data)
    let validation = await fetchPost(
      'https://test-index.murmurations.network/v2/validate',
      profile
    )
    let body = await validation.json()
    if (validation.status === 400) {
      // return json(body, { status: 400 })
      return new Response(JSON.stringify(body), { status: 400 })
    } else if (validation.status === 200) {
      if (body.status === 400) {
        // return json(body.failure_reasons, { status: 400 })
        return new Response(JSON.stringify(body.failure_reasons), {
          status: 400
        })
      }
      // return json(profile, { status: 200 })
      return new Response(JSON.stringify(profile), { status: 200 })
    } else {
      // return json('Some other validation response error', { status: 400 })
      return new Response('Some other validation response error', {
        status: 400
      })
    }
  }
  if (_action === 'select') {
    let schemaUrl = `https://test-cdn.murmurations.network/schemas/${data.schema}.json`
    return await parseRef(schemaUrl)
  }
}

export async function loader() {
  let response = await fetch(
    'https://test-library.murmurations.network/v1/schemas'
  )
  return await response.json()
}

export default function Index() {
  let schemas = useLoaderData()
  let data = useActionData()
  let schema
  if (data?.$schema) {
    schema = data
  }
  return (
    <div>
      <h1>JSON Schema - Remix</h1>
      <Form method="post">
        <select id="schema" name="schema">
          {schemas.data.map(schema => (
            <option value={schema.name} key={schema.name}>
              {schema.name}
            </option>
          ))}
        </select>
        <button type="submit" name="_action" value="select">
          Select
        </button>
      </Form>
      <hr />
      {schema ? (
        <Form method="post">
          {generateForm(schema)}
          <button type="submit" name="_action" value="submit">
            Submit
          </button>
        </Form>
      ) : (
        'Select a schema...'
      )}
    </div>
  )
}
