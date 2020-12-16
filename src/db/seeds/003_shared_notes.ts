import * as Knex from 'knex';

const TABLE_NAME = 'shared_notes';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();

  // Inserts seed entries
  await knex(TABLE_NAME).insert([
    {
      note_id: 1,
      link: 'a6c87f29b6e4bb91108d172753250e44',
    },
    {
      note_id: 2,
      link: '7882a18ccd5e2173024b8056c00c2f44',
    },
    {
      note_id: 3,
      link: '32440e17c8debe7664830dcfa777cca2',
    },
    {
      note_id: 4,
      link: 'f735b1b71505af890f2c34f00be74a6b',
    },
    {
      note_id: 5,
      link: 'ef4d1ee2d575ba929bbe5884556db25a',
    },
    {
      note_id: 6,
      link: '62ecf8a531b49c4f983f3f8d496c2883',
    },
    {
      note_id: 7,
      link: 'bc3c6f5e32f3981d48ce13fa77657eec',
    },
    {
      note_id: 8,
      link: 'fb4730f17922ffceae3fd4a16fe86f83',
    },
    {
      note_id: 9,
      link: '2a63005f94f41681d91b121165c41f77',
    },
    {
      note_id: 10,
      link: 'e7cda6296c396b15501f69033bc7cae9',
    },
    {
      note_id: 11,
      link: '4062f9d2f046a275de678cdd323cfb3e',
    },
    {
      note_id: 12,
      link: '8f40041c2ff14f1a4bab3abf6afeebc8',
    },
    {
      note_id: 13,
      link: 'a9db3f0124e3c3b9027983e3ccaabda3',
    },
    {
      note_id: 14,
      link: '144b75aa774889ba80c6b22760a0833c',
    },
    {
      note_id: 15,
      link: '06d6c4912a10112461c365f32355f22c',
    },
  ]);
}
