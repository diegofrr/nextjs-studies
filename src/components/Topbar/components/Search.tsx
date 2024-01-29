'use client';

import { useState } from 'react';

import Icons from '@/icons';

import { FetchSuggestionsOptionsType, fetchSuggestions } from '@/services/actions/fetchSuggestionsData';
import { isFakeDataFetch } from '@/environments';
import { Input } from '@nextui-org/react';

export default function Search() {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
  const [suggestions, setSuggestions] = useState<string[]>();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function getSuggestionsController({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => getSuggestions(target.value), 200));
  }

  function handleClearSuggestions() {
    setSuggestions([]);
    setIsOpen(false);
  }

  function handleCloseSuggestions() {
    setIsOpen(false);
  }

  async function getSuggestions(search: string) {
    const searchCheck = search.replace(/\s/g, '');
    if (!searchCheck || searchCheck.length < 3) return setIsOpen(false);

    const query = search.split(' ').join('+');

    const options = { query, isFake: isFakeDataFetch, delay: 1 } as FetchSuggestionsOptionsType;

    try {
      const data = await fetchSuggestions({ options });
      setSuggestions(data[1]);
      setIsOpen(true);
    } catch (err) {
      setIsOpen(false);
      console.error(err);
    }
  }

  return (
    <>
      <div className="w-full sm:max-w-md lg:max-w-lg h-10 relative z-30">
        <Input
          onChange={getSuggestionsController}
          value={searchValue}
          onClear={handleClearSuggestions}
          onValueChange={setSearchValue}
          placeholder="Pesquisar..."
          isClearable
          startContent={<Icons.Search size={14} />}
          classNames={{
            mainWrapper: 'h-full',
            input: 'text-small',
            inputWrapper:
              'h-full font-normal text-default-500 border-1 bg-neutral-100 dark:bg-neutral-900 border-1 border-neutral-200 dark:border-none'
          }}
          radius="full"
          type="search"
          size="sm"
        />
        {!isOpen ? null : (
          <div className="w-full p-2 overflow-hidden rounded-lg mt-2 border-1 dark:border-none bg-neutral-100 dark:bg-neutral-900">
            <ul>
              {suggestions?.map((suggestion) => (
                <li
                  className="cursor-pointer p-1 rounded-lg px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  key={suggestion}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!isOpen ? null : (
        <span onClick={handleCloseSuggestions} className="fixed opacity-40 bg-black top-0 left-0 right-0 bottom-0" />
      )}
    </>
  );
}
